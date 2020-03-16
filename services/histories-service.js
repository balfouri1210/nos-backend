const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const moment = require('moment');
// const { extractUserInfoFromJWT } = require('./auth-service');

module.exports.getHistory = async ({ historyId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [histories] = await connection.query(`
        SELECT *
        FROM histories
        WHERE id='${historyId}'
      `);

      if (!histories) {
        throw new Error(errors.GET_HISTORIES_FAILED.message);
      }

      return histories[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getHistories = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      const [histories] = await connection.query(`
        SELECT *
        FROM histories
        ORDER BY id DESC
      `);

      if (!histories) {
        throw new Error(errors.GET_HISTORIES_FAILED.message);
      }

      return histories;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.addHistories = async (historyTerm) => {
  try {
    const connection = await pool.getConnection();

    try {
      const date = new Date();

      const [insertedHistory] = await connection.query(`
        INSERT INTO histories
        (start_date, end_date)
        VALUES (
          '${moment(new Date(date.getTime() - historyTerm)).utc().format('YYYY-MM-DD HH:mm:ss')}',
          '${moment(date).utc().format('YYYY-MM-DD HH:mm:ss')}'
        )
      `);

      if (!insertedHistory) throw new Error(errors.REGISTER_HISTORY_FAILED.message);

      return insertedHistory.insertId;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getAndInsertTop100Players = async (historyId) => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.query(`
        INSERT INTO players_histories
        (histories_id, players_id, hits, vote_up_count, vote_down_count, comment_count)
        SELECT ${historyId}, id, hits, vote_up_count, vote_down_count, comment_count
        FROM players
        ORDER BY players.hits + players.vote_up_count + players.vote_down_count + players.comment_count DESC, players.id DESC
        LIMIT 100
      `);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getPlayerHistories = async ({ historyId }, { previousPlayerIdList }) => {
  try {
    const connection = await pool.getConnection();
    previousPlayerIdList = previousPlayerIdList || '""';

    try {
      const [playerHistories] = await connection.query(`
        SELECT players_histories.hits, players_histories.vote_up_count, players_histories.vote_down_count, players_histories.comment_count,
        (players_histories.hits + players_histories.vote_up_count + players_histories.vote_down_count + players_histories.comment_count) as score,
        players.id, players.known_as, players.birthday, players.nationality, players.height, players.club_team_id, players.position,
        countries.name as country_name, countries.code as country_code
        FROM players_histories
        LEFT JOIN players ON players_histories.players_id = players.id
        LEFT JOIN countries ON players.nationality = countries.id
        WHERE histories_id='${historyId}' AND
        players.id NOT IN (${previousPlayerIdList.toString()})
        LIMIT 20
      `);

      if (!playerHistories) {
        throw new Error(errors.GET_HISTORIES_FAILED.message);
      }

      return playerHistories;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};