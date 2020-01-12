const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');

module.exports.voteAction = async (tableName, { userId, commentId, replyId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update comment vote_count
      const voteSql = `
        UPDATE ${tableName} SET
        vote_${action}_count=vote_${action}_count+1
        WHERE id='${commentId || replyId}'
      `;

      const [votedResult] = await connection.query(voteSql);
      if (!votedResult) throw new Error(errors.UPDATE_OPINION_VOTE_FAILED.message);

      const registeredHistory = await voteHistoryService.registerVoteHistory(tableName.slice(0, -1), userId, commentId, replyId, action);
      if (!registeredHistory) throw new Error(errors.REGISTER_VOTE_HISTORY_FAILED.message);

      return {
        votedResult,
        registeredHistory
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};
