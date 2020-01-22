const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getVoteHistoriesByUserId = async ({ targetOpinion, userId }) => {
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

module.exports.registerVoteHistory = async ({ targetOpinion, targetOpinionId, userId, action }) => {
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

module.exports.deleteVoteHistory = async ({ targetOpinion, targetOpinionId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [registeredHistory] = await connection.query(`
        DELETE FROM ${targetOpinion}_vote_histories
        WHERE ${targetOpinion}_id=${targetOpinionId}
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