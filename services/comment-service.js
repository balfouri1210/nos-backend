const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const { extractUserIdFromJWT } = require('./auth-service');

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
    throw new Error(err.message || err);
  }
};

module.exports.getPlayerCommentsByPlayerId = async (authorization, { playerId }, { sortType, page }) => {
  try {
    const table = 'player_comments';
    const howManyCommentEachRequest = 10;
    const commentPage = page || 1;
    let orderByQuery;
    switch (sortType) {
      case 'date' :
        orderByQuery = `${table}.id DESC`;
        break;

      case 'like' :
      default :
        orderByQuery = `${table}.vote_up_count DESC, ${table}.vote_down_count, ${table}.id`;
      break;
    }

    const [comments] = await pool.query(`
      SELECT ${table}.id, ${table}.users_id, ${table}.created_at,
      content, vote_up_count, vote_down_count, username, reply_count FROM ${table}
      LEFT JOIN users ON ${table}.users_id = users.id
      WHERE player_id='${playerId}'
      ORDER BY ${orderByQuery} LIMIT ${howManyCommentEachRequest} OFFSET ${howManyCommentEachRequest * (commentPage - 1)}`
    );

    const userId = extractUserIdFromJWT(authorization);

    if (userId) {
      const commentVoteHistories = await voteHistoryService.getVoteHistoriesByUserId({
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
      // Query
      const [createdResult] = await connection.query(`
        INSERT INTO player_comments (users_id, player_id, content)
        VALUES (?, ?, ?)
      `, [userId, playerId, content]);

      if (!createdResult) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      const table = 'player_comments';
      const [createdComment] = await connection.query(`
        SELECT ${table}.id, ${table}.users_id, ${table}.created_at,
        content, vote_up_count, vote_down_count, username, reply_count FROM ${table}
        LEFT JOIN users ON ${table}.users_id = users.id
        WHERE ${table}.id='${createdResult.insertId}'
      `);

      if (!createdComment.length) {
        throw new Error(errors.GET_COMMENT_FAILED.message);
      }

      return createdComment[0];
    } finally {
      connection.release();
    }
  } catch (err) {
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

module.exports.deletePlayerComment = async ({ commentId }) => {
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

      return deletedComment;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
