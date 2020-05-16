const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoriesService = require('./vote-histories-service');
const notificationService = require('./notification-service');
const { extractUserInfoFromJWT } = require('./auth-service');

// OPINION
module.exports.opinionVote = async (authorization, { targetAuthorId, targetOpinion, targetOpinionId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);
    let result;

    try {
      const voteHistory = await voteHistoriesService.getOpinionVoteHistory({
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
            voteHistoriesService.deleteOpinionVoteHistory({ targetOpinion, targetOpinionId, userId })
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
          voteHistoriesService.registerOpinionVoteHistory({ targetOpinion, targetOpinionId, userId, vote }),
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
// 프론트에서 투표를 연속적으로 계속 하면 (up -> fire -> bomb ... 이런식으로)
// 요청과 요청이 겹치는 사이에 vote history 엉킴으로 인해 오작동이 발생한다.
// 일단 프론트에서 하나의 투표 요청이 끝나기 전에 또다른 요청을 하지 못하도록 해놨지만
// 개선이 필요한 것 같다. 위 현상과 더불어 처리 시간도 꽤 긴 느낌이다.
module.exports.playerVote = async (authorization, { playerId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      const voteHistory = await voteHistoriesService.getPlayerVoteHistoryByUserId({
        playerId,
        userId
      });

      if (voteHistory) {
        // 투표 기록이 있으면 해당 투표 취소
        await this.cancelPlayerVote(authorization, {
          playerId,
          vote: voteHistory.vote
        });
      }

      await Promise.all([
        // 투표 진행
        connection.query(`
          UPDATE players SET
          vote_${vote}_count=vote_${vote}_count+1
          WHERE id='${playerId}'
        `),

        // 투표 기록 등록
        voteHistoriesService.registerPlayerVoteHistory({ playerId, userId, vote })
      ]);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.cancelPlayerVote = async (authorization, { playerId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      await Promise.all([
        // Decrease player vote count
        connection.query(`
          UPDATE players SET
          vote_${vote}_count=vote_${vote}_count-1
          WHERE id='${playerId}'
        `),

        voteHistoriesService.deletePlayerVoteHistory({ playerId, userId })
      ]);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

// module.exports.cancelPlayerVote = async (authorization, { playerId }) => {
//   try {
//     const connection = await pool.getConnection();
//     const { userId } = extractUserInfoFromJWT(authorization);

//     try {
//       await Promise.allvoteHistoriesService.deletePlayerVoteHistory({ playerId, userId });

//       return;
//     } finally {
//       connection.release();
//     }
//   } catch (err) {
//     console.error(err);
//     throw new Error(err.message || err);
//   }
// };
