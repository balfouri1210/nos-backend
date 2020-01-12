const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getVoteHistoriesByUserId = async (targetTable, { userId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const getVoteHistoriesSql = `
        SELECT * FROM ${targetTable}
        WHERE user_id='${userId}'
        ORDER BY id DESC
      `;

      const [voteHistories] = await connection.query(getVoteHistoriesSql);
      if (!voteHistories) throw new Error(errors.GET_VOTE_HISTORIES_FAILED.message);
      const result = voteHistories.map((history) => {
        return {
          targetId: history.player_comment_id,
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

module.exports.registerVoteHistory = async (targetTable, userId, targetId, action) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const registerVoteHistorySql = `
        INSERT INTO ${targetTable.slice(0, -1)}_vote_histories
        (user_id, ${targetTable.slice(0, -1)}_id, vote)
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

module.exports.deleteVoteHistory = async (targetTable, targetId) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const registerVoteHistorySql = `
        DELETE FROM ${targetTable.slice(0, -1)}_vote_histories
        WHERE ${targetTable.slice(0, -1)}_id=${targetId}
      `;

      console.log(registerVoteHistorySql);

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