const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const playerService = require('./player-service');
const { extractUserInfoFromJWT } = require('./auth-service');

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
  // minPoint : upvote - downvote 정렬일 때 페이징 처리를 위한 변수 
  // previousCommentIdList : upvote - downvote 정렬일 때 이미 로드된 댓글들의 아이디 목록 (걔네를 제외하고 검색해야 하기 때문)
) => {
  try {
    const table = 'player_comments';
    const howManyCommentEachRequest = 10;

    // 최초 로드시 minId가 없으므로 최대값으로 설정하여 가장 큰 id를 가진 comment부터 가져오도록 한다.
    minId = minId || 2147483647;
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
      whereQuery = `player_id='${playerId}' and ${table}.id NOT IN (${previousCommentIdList.toString()})`;
      break;
    }

    const [comments] = await pool.query(`
      SELECT ${table}.id, ${table}.users_id, ${table}.created_at,
      content, vote_up_count, vote_down_count, username, reply_count
      FROM ${table}
      LEFT JOIN users ON ${table}.users_id = users.id
      WHERE ${whereQuery}
      ORDER BY ${orderByQuery}
      LIMIT ${howManyCommentEachRequest}`
    );

    if (authorization) {
      const { userId } = extractUserInfoFromJWT(authorization);

      const commentVoteHistories = await voteHistoryService.getOpinionVoteHistoriesByUserId({
        targetOpinion: table,
        userId
      });
      comments.forEach(comment => {
        commentVoteHistories.forEach(history => {
          if (history.targetOpinionId === comment.id) {
            comment.isVoted = history.vote;
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

module.exports.addPlayerComment = async ({ userId, playerId, content }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const table = 'player_comments';

      // Add comment
      const [createdResult] = await connection.query(`
        INSERT INTO ${table} (users_id, player_id, content)
        VALUES (?, ?, ?)
      `, [userId, playerId, content]);

      if (!createdResult) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      // Get added comment to return to frontend
      const [createdComment] = await connection.query(`
        SELECT ${table}.id, ${table}.users_id, ${table}.created_at,
        content, vote_up_count, vote_down_count, username, reply_count FROM ${table}
        LEFT JOIN users ON ${table}.users_id = users.id
        WHERE ${table}.id='${createdResult.insertId}'
      `);

      if (!createdComment.length) {
        throw new Error(errors.GET_COMMENT_FAILED.message);
      }

      // Increase player comment count
      await playerService.increasePlayerCommentsCount(playerId, 'increase');

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
    const connection = await pool.getConnection();

    try {
      // Query
      const [edittedComment] = await connection.query(`
        UPDATE player_comments SET
        content='${newContent}'
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
      // Query
      const [deletedComment] = await connection.query(`
        DELETE FROM player_comments
        WHERE id='${commentId}'
      `);

      const [deletedReplies] = await connection.query(`
        DELETE FROM player_replies
        WHERE parent_comments_id='${commentId}'
      `);

      if (!deletedComment || !deletedReplies) {
        throw new Error(errors.DELETE_COMMENT_FAILED.message);
      }

      // Decrease player comment count
      await playerService.increasePlayerCommentsCount(playerId, 'decrease');

      return deletedComment;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
