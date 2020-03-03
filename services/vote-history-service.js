const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

// OPINION
module.exports.getOpinionVoteHistoriesByUserId = async ({ targetOpinion, userId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [voteHistories] = await connection.query(`
        SELECT * FROM ${targetOpinion}_vote_histories
        WHERE users_id='${userId}'
        ORDER BY id DESC
      `);
      if (!voteHistories) throw new Error(errors.GET_VOTE_HISTORIES_FAILED.message);
      const result = voteHistories.map((history) => {
        return {
          targetOpinionId: history[`${targetOpinion}_id`],
          vote: history.vote
        };
      });

      return result;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.registerOpinionVoteHistory = async ({ targetOpinion, targetOpinionId, userId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [registeredHistory] = await connection.query(`
        INSERT INTO ${targetOpinion}_vote_histories
        (users_id, ${targetOpinion}_id, vote)
        VALUES ('${userId}', '${targetOpinionId}', '${action}')
      `);
      if (!registeredHistory) throw new Error(errors.REGISTER_VOTE_HISTORY_FAILED.message);

      return registeredHistory;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.deleteOpinionVoteHistory = async ({ targetOpinion, targetOpinionId, userId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [registeredHistory] = await connection.query(`
        DELETE FROM ${targetOpinion}_vote_histories
        WHERE ${targetOpinion}_id=${targetOpinionId} AND users_id=${userId}
      `);
      if (!registeredHistory) throw new Error(errors.DELETE_VOTE_HISTORY_FAILED.message);

      return registeredHistory;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};


// PLAYER
module.exports.getPlayerVoteHistoriesByUserId = async ({ userId, playerId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [voteHistory] = await connection.query(`
        SELECT * FROM players_vote_histories
        WHERE users_id='${userId}' AND players_id='${playerId}'
      `);
      if (!voteHistory) throw new Error(errors.GET_VOTE_HISTORIES_FAILED.message);

      return voteHistory[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.registerPlayerVoteHistory = async ({ playerId, userId, action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [registeredHistory] = await connection.query(`
        INSERT INTO players_vote_histories
        (users_id, players_id, vote)
        VALUES ('${userId}', '${playerId}', '${action}')
      `);
      if (!registeredHistory) throw new Error(errors.REGISTER_VOTE_HISTORY_FAILED.message);

      return registeredHistory;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.deletePlayerVoteHistory = async ({ playerId, userId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [registeredHistory] = await connection.query(`
        DELETE FROM players_vote_histories
        WHERE players_id=${playerId} AND users_id=${userId}
      `);
      if (!registeredHistory) throw new Error(errors.DELETE_VOTE_HISTORY_FAILED.message);

      return registeredHistory;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};