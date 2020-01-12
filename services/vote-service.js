const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');

module.exports.vote = async ({ targetTable, userId, targetId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update comment vote_count
      const voteSql = `
        UPDATE ${targetTable} SET
        vote_${action}_count=vote_${action}_count+1
        WHERE id='${targetId}'
      `;

      const [votedResult] = await connection.query(voteSql);
      if (!votedResult) throw new Error(errors.UPDATE_OPINION_VOTE_FAILED.message);

      const registeredHistory = await voteHistoryService.registerVoteHistory(
        targetTable,
        userId,
        targetId,
        action
      );
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

module.exports.cancelVote = async ({ targetTable, targetId, action }) => {
  console.log('cancel vote');
  
  try {
    const connection = await pool.getConnection();

    try {
      // Update comment vote_count
      const voteSql = `
        UPDATE ${targetTable} SET
        vote_${action}_count=vote_${action}_count-1
        WHERE id='${targetId}'
      `;

      const [votedResult] = await connection.query(voteSql);
      if (!votedResult) throw new Error(errors.UPDATE_OPINION_VOTE_FAILED.message);

      const deletedHistory = await voteHistoryService.deleteVoteHistory(
        targetTable,
        targetId,
      );
      if (!deletedHistory) throw new Error(errors.REGISTER_VOTE_HISTORY_FAILED.message);

      return {
        votedResult,
        deletedHistory
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};