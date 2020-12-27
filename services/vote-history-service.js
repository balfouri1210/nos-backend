const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

// OPINION
module.exports.getOpinionVoteHistory = async ({ targetOpinion, targetOpinionId, userId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [voteHistory] = await connection.query(`
        SELECT * FROM ${targetOpinion}_vote_histories
        WHERE ${targetOpinion}_id='${targetOpinionId}' AND user_id='${userId}'
        ORDER BY id DESC
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

module.exports.getOpinionVoteHistoriesByUserId = async ({ targetOpinion, userId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [voteHistories] = await connection.query(`
        SELECT * FROM ${targetOpinion}_vote_histories
        WHERE user_id='${userId}'
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

module.exports.registerOpinionVoteHistory = async ({ targetOpinion, targetOpinionId, userId, vote }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [registeredHistory] = await connection.query(`
        INSERT INTO ${targetOpinion}_vote_histories
        (user_id, ${targetOpinion}_id, vote)
        VALUES ('${userId}', '${targetOpinionId}', '${vote}')
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

module.exports.updateOpinionVoteHistory = async ({ userId, targetOpinion, targetOpinionId, vote }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update vote history
      const [updatedHistory] = await connection.query(`
        UPDATE ${targetOpinion}_vote_histories
        SET vote='${vote}'
        WHERE ${targetOpinion}_id=${targetOpinionId} AND user_id=${userId}
      `);
      if (!updatedHistory) throw new Error(errors.UPDATE_VOTE_HISTORY_FAILED.message);

      return updatedHistory;
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
        WHERE ${targetOpinion}_id=${targetOpinionId} AND user_id=${userId}
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

module.exports.deleteAllOpinionVoteHistory = async (targetOpinion) => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.query(`
        DELETE FROM ${targetOpinion}_vote_histories
      `);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};


// PLAYER
module.exports.getPlayerVoteHistoryByUserId = async ({ userId, playerId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [voteHistory] = await connection.query(`
        SELECT * FROM player_vote_histories
        WHERE user_id='${userId}' AND player_id='${playerId}'
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

module.exports.registerPlayerVoteHistory = async ({ playerId, userId, vote }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Make new vote history
      const [registeredHistory] = await connection.query(`
        INSERT INTO player_vote_histories
        (user_id, player_id, vote)
        VALUES ('${userId}', '${playerId}', '${vote}')
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

module.exports.updatePlayerVoteHistory = async ({ playerId, userId, vote }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Update vote history
      const [updatedHistory] = await connection.query(`
        UPDATE player_vote_histories
        SET vote='${vote}'
        WHERE player_id=${playerId} AND user_id=${userId}
      `);
      if (!updatedHistory) throw new Error(errors.UPDATE_VOTE_HISTORY_FAILED.message);

      return updatedHistory;
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
        DELETE FROM player_vote_histories
        WHERE player_id=${playerId} AND user_id=${userId}
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


module.exports.deletePlayerVoteHistory = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.query(`
        DELETE FROM player_vote_histories
      `);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};
