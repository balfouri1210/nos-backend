const pool = require('../database/db-connection');
const { errors, constants } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const notificationService = require('./notification-service');
const { extractUserInfoFromJWT } = require('./auth-service');
const moment = require('moment');

// OPINION
module.exports.opinionVote = async (authorization, { targetAuthorId, targetOpinion, targetOpinionId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      await Promise.all([
        // Increase opinion vote count
        connection.query(`
          UPDATE ${targetOpinion}s SET
          vote_${vote}_count=vote_${vote}_count+1
          WHERE id='${targetOpinionId}'
        `),

        // Register vote history
        voteHistoryService.registerOpinionVoteHistory({ targetOpinion, targetOpinionId, userId, vote }),
      ]);

      const votedOpinion = (await connection.query(`
        SELECT * FROM ${targetOpinion}s
        WHERE id='${targetOpinionId}'
      `))[0][0];

      if (!votedOpinion) throw new Error(errors.GET_VOTED_OPINION_FAILED.message);

      // Add new notification when opinion is comment
      if (targetOpinion === 'player_comment' && votedOpinion.vote_up_count > 0) {
        notificationService.addNotification({
          recipientId: targetAuthorId,
          senderId: userId,
          object: 'player',
          objectId: votedOpinion.player_id,
          type: 'vote_up',
          content: votedOpinion.vote_up_count
        });

        if (votedOpinion.vote_up_count === constants.hotCommentVoteCriteria)
          this.registerBestComment(connection, targetOpinionId);
      }

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.registerBestComment = async (connection, targetOpinionId) => {
  try {
    await connection.query(`
        UPDATE player_comments SET
        best_commented_at='${moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')}'
        WHERE id='${targetOpinionId}'
      `);

    return;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};


module.exports.updateOpinionVote = async (authorization, { targetOpinion, targetOpinionId, previousVote, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      await Promise.all([
        // 리액션 업데이트
        connection.query(`
          UPDATE ${targetOpinion}s SET
          vote_${previousVote}_count=vote_${previousVote}_count-1,
          vote_${vote}_count=vote_${vote}_count+1
          WHERE id='${targetOpinionId}'
        `),

        // 리액션 기록 업데이트
        voteHistoryService.updateOpinionVoteHistory({ userId, targetOpinion, targetOpinionId, vote })
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

module.exports.cancelOpinionVote = async (authorization, { targetOpinion, targetOpinionId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      await Promise.all([
        // Increase opinion vote count
        connection.query(`
          UPDATE ${targetOpinion}s SET
          vote_${vote}_count=vote_${vote}_count-1
          WHERE id='${targetOpinionId}'
        `),

        // Delete vote history
        voteHistoryService.deleteOpinionVoteHistory({ targetOpinion, targetOpinionId, userId })
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



// PLAYER
module.exports.playerVote = async (authorization, { playerId, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      await Promise.all([
        // 리액션 진행
        connection.query(`
          UPDATE players SET
          vote_${vote}_count=vote_${vote}_count+1
          WHERE id='${playerId}'
        `),

        // 리액션 기록 등록
        voteHistoryService.registerPlayerVoteHistory({ playerId, userId, vote })
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

module.exports.updatePlayerVote = async (authorization, { playerId, previousVote, vote }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      await Promise.all([
        // 리액션 업데이트
        connection.query(`
          UPDATE players SET
          vote_${previousVote}_count=vote_${previousVote}_count-1,
          vote_${vote}_count=vote_${vote}_count+1
          WHERE id='${playerId}'
        `),

        // 리액션 기록 업데이트
        voteHistoryService.updatePlayerVoteHistory({ playerId, userId, vote })
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
        // 리액션 삭제
        connection.query(`
          UPDATE players SET
          vote_${vote}_count=vote_${vote}_count-1
          WHERE id='${playerId}'
        `),

        // 리액션 기록 삭제
        voteHistoryService.deletePlayerVoteHistory({ playerId, userId })
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




// PLAYER VOTE FAKE
module.exports.playerVoteFake = async (authorization, { playerId, vote }) => {
  try {
    const connection = await pool.getConnection();

    try {
      await Promise.all([
        // 리액션 진행
        connection.query(`
          UPDATE players SET
          vote_${vote}_count=vote_${vote}_count+1
          WHERE id='${playerId}'
        `),
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

module.exports.opinionVoteFake = async (authorization, { targetAuthorId, targetOpinion, targetOpinionId, vote }) => {
  try {
    const connection = await pool.getConnection();

    try {
      await Promise.all([
        // Increase opinion vote count
        connection.query(`
          UPDATE ${targetOpinion}s SET
          vote_${vote}_count=vote_${vote}_count+1
          WHERE id='${targetOpinionId}'
        `),
      ]);

      const votedOpinion = (await connection.query(`
        SELECT * FROM ${targetOpinion}s
        WHERE id='${targetOpinionId}'
      `))[0][0];

      if (!votedOpinion) throw new Error(errors.GET_VOTED_OPINION_FAILED.message);

      if (targetOpinion === 'player_comment' && votedOpinion.vote_up_count === constants.hotCommentVoteCriteria)
        this.registerBestComment(connection, targetOpinionId);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
