const pool = require('../database/db-connection');
const { errors, constants } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const replyService = require('./reply-service');
const playerService = require('./player-service');
const { extractUserInfoFromJWT } = require('./auth-service');
const moment = require('moment');

module.exports.getTotalCommentsCount = async () => {
  try {
    const [totalCommentsCount, totalHotCommentsCount] = await Promise.all([
      pool.query(`
        SELECT COUNT(*) AS COUNT FROM player_comments
      `),

      pool.query(`
        SELECT COUNT(*) AS COUNT FROM player_comments
        WHERE vote_up_count >= ${constants.hotCommentVoteCriteria}
      `)
    ]);

    return {
      totalCommentsCount: totalCommentsCount[0][0].COUNT,
      totalHotCommentsCount: totalHotCommentsCount[0][0].COUNT
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getPlayerCommentsCountByPlayerId = async ({ playerId }) => {
  try {
    const [playerCommentsCount] = await pool.query(`
      SELECT COUNT(*) AS COUNT FROM player_comments
      WHERE player_id='${playerId}'
    `);

    if (!playerCommentsCount.length) {
      throw new Error(errors.GET_COMMENT_COUNT_FAILED.message);
    }
    return {
      playerCommentsCount: playerCommentsCount[0].COUNT
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getPlayerCommentsByPlayerId = async (
  authorization,
  { playerId },
  { sortType, minId, previousCommentIdList }
  // minId: date 정렬일 때 페이징 처리를 위한 변수
  // previousCommentIdList : like 정렬일 때 이미 로드된 댓글들의 아이디 목록 (걔네를 제외하고 검색해야 하기 때문)
) => {
  try {
    const table = 'player_comments';
    const howManyCommentEachRequest = 10;

    // 최초 로드시 minId가 없으므로 최대값으로 설정하여 가장 큰 id를 가진 comment부터 가져오도록 한다.
    minId = minId || constants.defaultMinId;
    // 최초 로드시 comment list가 존재하지 않으므로 빈값을 할당한다.
    previousCommentIdList = previousCommentIdList || '""';

    let orderByQuery, whereQuery;
    switch (sortType) {
    case 'date' :
      orderByQuery = `${table}.id DESC`;
      whereQuery = `player_id='${playerId}' and ${table}.id < ${minId}`;
      break;

    case 'like' :
    default :
      orderByQuery = `(${table}.vote_up_count - ${table}.vote_down_count) DESC, ${table}.id DESC`;
      whereQuery = `player_id='${playerId}' and ${table}.id NOT IN (${previousCommentIdList})`;
      break;
    }

    const [comments] = await pool.query(`
      SELECT ${table}.id, ${table}.user_id, ${table}.created_at, ${table}.fake_username,
      content, vote_up_count, vote_down_count, username, reply_count, authorization as user_authorization
      FROM ${table}
      LEFT JOIN users ON ${table}.user_id = users.id
      WHERE ${whereQuery}
      ORDER BY ${orderByQuery}
      LIMIT ${howManyCommentEachRequest}`
    );

    // Vote history mapping
    if (authorization) {
      const { userId } = extractUserInfoFromJWT(authorization);

      const commentVoteHistories = await voteHistoryService.getOpinionVoteHistoriesByUserId({
        targetOpinion: 'player_comment',
        userId
      });
      comments.forEach(comment => {
        commentVoteHistories.forEach(history => {
          if (history.targetOpinionId === comment.id) {
            comment.vote = history.vote;
          }
        });
      });
    }

    return comments;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_COMMENT_FAILED.message);
  }
};

module.exports.getPlayerCommentsPreview = async ({ playerIdList, count }) => {
  try {
    const connection = await pool.getConnection();

    try {
      playerIdList = playerIdList.split(',');
      let query = [];

      playerIdList.forEach(playerId => {
        query.push(`
          (SELECT player_comments.*, users.username
          FROM player_comments
          LEFT JOIN users ON player_comments.user_id=users.id
          WHERE player_id=${playerId}
          ORDER BY player_comments.id DESC
          LIMIT ${count || 3})
        `);
      });
      query = query.join(' union all ');

      const [playerComments] = await connection.query(query);

      return playerComments;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_COMMENT_FAILED.message);
  }
};

module.exports.getWholePlayerComments = async ({ sortType, commentsPerRequest, page }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      let query;
      let commonQuery = `SELECT user_id, player_comments.content, player_comments.created_at, player_comments.reply_count, player_comments.vote_up_count,
        players.id as player_id, players.known_as as player_name, clubs.image as club_image
        FROM player_comments
        LEFT JOIN players ON players.id = player_comments.player_id
        LEFT JOIN clubs ON clubs.id = players.club_id`;

      switch (sortType) {
      case 'date':
        query = `
          ${commonQuery}
          ORDER BY player_comments.id DESC
          LIMIT ${commentsPerRequest}
          OFFSET ${commentsPerRequest * (page - 1)}
        `;
        break;

      case 'vote':
        query = `
          ${commonQuery}
          WHERE player_comments.vote_up_count >= ${constants.hotCommentVoteCriteria}
          ORDER BY player_comments.best_commented_at DESC
          LIMIT ${commentsPerRequest}
          OFFSET ${commentsPerRequest * (page - 1)}
        `;
        break;
      }

      const [comments] = await connection.query(query);

      return comments;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.addPlayerComment = async (authorization, { playerId, content }) => {
  try {
    if (!content)
      throw new Error(errors.NO_COMMENT_CONTENT.message);

    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      const table = 'player_comments';

      // Add comment
      const [createdResult] = await connection.query(`
        INSERT INTO ${table} (user_id, player_id, content)
        VALUES (?, ?, ?)
      `, [userId, playerId, content]);

      if (!createdResult) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      // Get added comment to return to frontend
      const [createdComment] = await connection.query(`
        SELECT ${table}.id, ${table}.user_id, ${table}.created_at,
        content, vote_up_count, vote_down_count, username, authorization as user_authorization, reply_count FROM ${table}
        LEFT JOIN users ON ${table}.user_id = users.id
        WHERE ${table}.id='${createdResult.insertId}'
      `);

      if (!createdComment.length)
        throw new Error(errors.GET_COMMENT_FAILED.message);

      // Increase player comment count & Update player degrees
      await playerService.mutatePlayerCommentsCount(playerId, 'increase');
      
      return createdComment[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.editPlayerComment = async ({ commentId }, { newContent }) => {
  try {
    if (!newContent)
      throw new Error(errors.NO_COMMENT_CONTENT.message);
    
    const connection = await pool.getConnection();

    try {
      // ' (apostrophe) 가 포함되면 mysql syntax error가 발생하기 때문. \'로 대체한다
      newContent = newContent.replace(/'/g, "\\'");

      // Query
      const [edittedComment] = await connection.query(`
        UPDATE player_comments SET
        content='${newContent}',
        updated_at='${moment().utc().format('YYYY-MM-DD HH:mm:ss')}'
        WHERE id='${commentId}'
      `);

      if (!edittedComment) {
        throw new Error(errors.EDIT_COMMENT_FAILED.message);
      }

      return edittedComment;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.deletePlayerComment = async ({ playerId, commentId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const deleteComment = () => {
        return connection.query(`
          DELETE FROM player_comments
          WHERE id='${commentId}'
        `);
      };

      const deleteCommentVoteHistories = () => {
        return connection.query(`
          DELETE FROM player_comment_vote_histories
          WHERE player_comment_id='${commentId}'
        `);
      };

      const [deletedComment] =
      await Promise.all([
        deleteComment(),
        deleteCommentVoteHistories(),
        replyService.deletePlayerReplyByParentCommentId(commentId),
        playerService.mutatePlayerCommentsCount(playerId, 'decrease')
      ]);

      if (!deletedComment) {
        throw new Error(errors.DELETE_COMMENT_FAILED.message);
      }

      return deletedComment;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};



// 프론트엔드와 단절된 함수들
module.exports.commentMigrationToHistories = async (historyId) => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.query(`
        INSERT INTO player_comment_histories 
        (history_id, id, user_id, player_id, content, vote_up_count, vote_down_count, reply_count, created_at, updated_at, best_commented_at, fake_username)
        SELECT ${historyId}, id, user_id, player_id, content, vote_up_count, vote_down_count, reply_count, created_at, updated_at, best_commented_at, fake_username
        FROM player_comments
      `);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.emptyPlayerComments = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      await connection.query(`
        DELETE FROM player_comments
      `);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};



// FAKE COMMENT !!
module.exports.addFakePlayerComment = async (authorization, { fakeUsername, playerId, content }) => {
  try {
    const connection = await pool.getConnection();
    const userId = 3;

    try {
      // Add comment
      const [createdResult] = await connection.query(`
        INSERT INTO player_comments (user_id, fake_username, player_id, content)
        VALUES (?, ?, ?, ?)
      `, [userId, fakeUsername, playerId, content]);

      if (!createdResult) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      // Get added comment to return to frontend
      const [createdComment] = await connection.query(`
        SELECT *
        FROM player_comments
        WHERE player_comments.id='${createdResult.insertId}'
      `);

      if (!createdComment.length) {
        throw new Error(errors.GET_COMMENT_FAILED.message);
      }

      // Increase player comment count & Update player degrees
      await playerService.mutatePlayerCommentsCount(playerId, 'increase');
      
      return createdComment[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
// FAKE COMMENT END
