const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const notificationService = require('./notification-service');
const { extractUserInfoFromJWT } = require('./auth-service');

// OPINION
module.exports.opinionVote = async (authorization, { targetAuthorId, targetOpinion, targetOpinionId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);
    let result;

    try {
      const voteHistory = await voteHistoryService.getOpinionVoteHistory({
        targetOpinion,
        targetOpinionId,
        userId
      });

      if (voteHistory) {
        if (voteHistory.vote === vote) {
          await Promise.all([
            // Decrease player vote count
            connection.query(`
              UPDATE ${targetOpinion} SET
              vote_${vote}_count=vote_${vote}_count-1
              WHERE id='${targetOpinionId}'
            `),

            // Delete vote history
            voteHistoryService.deleteOpinionVoteHistory({ targetOpinion, targetOpinionId, userId })
          ]);

          result = 'cancelled';
        } else {
          throw new Error(errors.ALREADY_VOTED_OPINION.message);
        }
      } else {
        await Promise.all([
          // Increase player vote count
          connection.query(`
            UPDATE ${targetOpinion} SET
            vote_${vote}_count=vote_${vote}_count+1
            WHERE id='${targetOpinionId}'
          `),

          // Register vote history
          voteHistoryService.registerOpinionVoteHistory({ targetOpinion, targetOpinionId, userId, vote }),
        ]);

        result = 'voted';
      }

      const votedOpinion = (await connection.query(`
        SELECT * FROM ${targetOpinion}
        WHERE id='${targetOpinionId}'
      `))[0][0];
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

      return result;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};


// PLAYER
module.exports.playerVote = async (authorization, { playerId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);
    let result;

    try {
      const voteHistory = await voteHistoryService.getPlayerVoteHistoryByUserId({
        playerId,
        userId
      });

      if (voteHistory) {
        if (voteHistory.vote === vote) {
          await Promise.all([
          // Decrease player vote count
            connection.query(`
            UPDATE players SET
            vote_${vote}_count=vote_${vote}_count-1
            WHERE id='${playerId}'
          `),

            voteHistoryService.deletePlayerVoteHistory({ playerId, userId })
          ]);

          result = 'cancelled';
        } else {
          throw new Error(errors.ALREADY_VOTED_PLAYER.message);
        }
      } else {
        await Promise.all([
          // Increase player vote count
          connection.query(`
            UPDATE players SET
            vote_${vote}_count=vote_${vote}_count+1
            WHERE id='${playerId}'
          `),

          // Register vote history
          voteHistoryService.registerPlayerVoteHistory({ playerId, userId, vote })
        ]);

        result = 'voted';
      }

      return result;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
