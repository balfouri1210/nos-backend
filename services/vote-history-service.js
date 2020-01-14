const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getVoteHistoriesByUserId = async (targetOpinion, userId) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const getVoteHistoriesSql = `
        SELECT * FROM ${targetOpinion}_vote_histories
        WHERE users_id='${userId}'
        ORDER BY id DESC
      `;

      const [voteHistories] = await connection.query(getVoteHistoriesSql);
      if (!voteHistories) throw new Error(errors.GET_VOTE_HISTORIES_FAILED.message);
      const result = voteHistories.map((history) => {
        return {
          targetId: history[`${targetOpinion}_id`],
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

module.exports.registerVoteHistory = async (targetOpinion, userId, targetId, action) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const registerVoteHistorySql = `
        INSERT INTO ${targetOpinion}_vote_histories
        (users_id, ${targetOpinion}_id, vote)
        VALUES ('${userId}', '${targetId}', '${action}')
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

module.exports.deleteVoteHistory = async (targetOpinion, targetId) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const registerVoteHistorySql = `
        DELETE FROM ${targetOpinion}_vote_histories
        WHERE ${targetOpinion}_id=${targetId}
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