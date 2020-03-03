const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const notificationService = require('./notification-service');
const { extractUserInfoFromJWT } = require('./auth-service');

// OPINION
module.exports.opinionVote = async (authorization, { targetAuthorId, targetOpinion, targetOpinionId, action }) => {
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

      const { userId } = extractUserInfoFromJWT(authorization);

      // Register vote history
      await voteHistoryService.registerOpinionVoteHistory({
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
      if (votedOpinion.vote_up_count > 0 && votedOpinion.vote_up_count % 20 === 0) {
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

module.exports.cancelOpinionVote = async (authorization, { targetOpinion, targetOpinionId, action }) => {
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

      const { userId } = extractUserInfoFromJWT(authorization);

      // Delete vote history
      await voteHistoryService.deleteOpinionVoteHistory({
        targetOpinion,
        targetOpinionId,
        userId
      });

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


// PLAYER
module.exports.playerVote = async (authorization, { playerId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update player vote_count
      const [votedResult] = await connection.query(`
        UPDATE players SET
        vote_${action}_count=vote_${action}_count+1
        WHERE id='${playerId}'
      `);
      if (!votedResult) throw new Error(errors.VOTE_PLAYER_FAILED.message);

      const { userId } = extractUserInfoFromJWT(authorization);

      // Register vote history
      await voteHistoryService.registerPlayerVoteHistory({
        playerId,
        userId,
        action
      });

      // Get voted player
      const [votedPlayer] = (await connection.query(`
        SELECT * FROM players
        WHERE id='${playerId}'
      `))[0];
      if (!votedPlayer) throw new Error(errors.GET_VOTED_PLAYER_FAILED.message);

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

module.exports.cancelPlayerVote = async (authorization, { playerId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update player vote_count
      const [votedResult] = await connection.query(`
        UPDATE players SET
        vote_${action}_count=vote_${action}_count-1
        WHERE id='${playerId}'
      `);
      if (!votedResult) throw new Error(errors.CANCEL_VOTE_PLAYER_FAILED.message);

      const { userId } = extractUserInfoFromJWT(authorization);

      // Delete vote history
      await voteHistoryService.deletePlayerVoteHistory({
        playerId,
        userId
      });

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