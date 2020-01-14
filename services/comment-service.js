const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');

module.exports.getPlayerCommentsByPlayerId = async ({ userId, playerId }) => {
  try {
    const table = 'player_comments';
    const [comments] = await pool.query(`
      SELECT ${table}.id, ${table}.users_id, ${table}.created_at, content, vote_up_count, vote_down_count, username, reply_count FROM ${table}
      LEFT JOIN users ON ${table}.users_id = users.id
      WHERE player_id='${playerId}'
      ORDER BY ${table}.id DESC LIMIT 10`
    );

    if (userId !== 'null') {
      const commentVoteHistories = await voteHistoryService.getVoteHistoriesByUserId(`${table}`, userId);
      comments.forEach(comment => {
        commentVoteHistories.forEach(history => {
          if (history.targetId === comment.id) {
            comment.isVoted = history.vote;
          }
        });
      });
    }

    return comments;
  } catch (err) {
    throw new Error(errors.GET_COMMENT_FAILED.message);
  }
};

module.exports.addPlayerComment = async ({ userId, playerId, content }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const insertSql = `
        INSERT INTO player_comments (users_id, player_id, content)
        VALUES (?, ?, ?)
      `;
      const params = [userId, playerId, content];
      const [createdComment] = await connection.query(insertSql, params);

      if (!createdComment) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      return {
        id: createdComment.insertId
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};
