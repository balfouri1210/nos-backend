const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getVoteHistoriesByUserId = async (tableName, { userId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const getVoteHistoriesSql = `
        SELECT * FROM ${tableName}
        WHERE user_id='${userId}'
        ORDER BY id DESC
      `;
      
      const [voteHistories] = await connection.query(getVoteHistoriesSql);
      if (!voteHistories.length) throw new Error(errors.GET_VOTE_HISTORIES_FAILED.message);
      const result = voteHistories.map((history) => {
        return history.player_comment_id;
      });

      return {
        voteHistories: result
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.registerVoteHistory = async (tableName, userId, commentId, replyId, action) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const registerVoteHistorySql = `
        INSERT INTO ${tableName}_vote_histories
        (user_id, ${tableName}_id, vote)
        VALUES ('${userId}', '${commentId || replyId}', '${action}')
      `;

      const [registeredHistory] = await connection.query(registerVoteHistorySql);
      if (!registeredHistory) throw new Error(errors.REGISTER_VOTE_HISTORY_FAILED.message);
      
      return registeredHistory;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};