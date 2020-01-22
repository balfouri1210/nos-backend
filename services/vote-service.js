const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const notificationService = require('./notification-service');

module.exports.vote = async ({ targetAuthorId, targetOpinion, targetOpinionId, userId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update comment vote_count
      const [votedResult] = await connection.query(`
        UPDATE ${targetOpinion} SET
        vote_${action}_count=vote_${action}_count+1
        WHERE id='${targetOpinionId}'
      `);
      if (!votedResult) throw new Error(errors.UPDATE_OPINION_VOTE_FAILED.message);

      // Register vote history
      await voteHistoryService.registerVoteHistory({
        targetOpinion,
        targetOpinionId,
        userId,
        action
      });

      // Get voted opinion
      const [votedOpinion] = (await connection.query(`
        SELECT * FROM ${targetOpinion}
        WHERE id='${targetOpinionId}'
      `))[0];
      if (!votedOpinion) throw new Error(errors.GET_VOTED_OPINION_FAILED.message);

      // Add new notification if vote_up_count is 20, 40, 60 ...
      if (votedOpinion.vote_up_count % 20 === 0) {
        notificationService.addNotification({
          recipientId: targetAuthorId,
          senderId: userId,
          object: targetOpinion.split('_')[0],
          objectId: targetOpinionId,
          type: 'vote_up',
          content: votedOpinion.vote_up_count
        });
      }

      return {
        votedResult
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.cancelVote = async ({ targetOpinion, targetOpinionId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update comment vote_count
      const [votedResult] = await connection.query(`
        UPDATE ${targetOpinion} SET
        vote_${action}_count=vote_${action}_count-1
        WHERE id='${targetOpinionId}'
      `);
      if (!votedResult) throw new Error(errors.UPDATE_OPINION_VOTE_FAILED.message);

      const deletedHistory = await voteHistoryService.deleteVoteHistory({
        targetOpinion,
        targetOpinionId,
      });
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