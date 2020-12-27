const pool = require('../../database/db-connection');
const { errors } = require('../../constants/index');
const moment = require('moment');

module.exports.getLatestHistoryId = async() => {
  try {
    const connection = await pool.getConnection();

    try {
      const [history] = await connection.query(`
        SELECT MAX(id) as latest_history_id FROM histories
      `);

      if (!history) {
        throw new Error(errors.GET_LATEST_HISTORY_ID_FAILED.message);
      }

      return history[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getHistories = async ({ year, month }) => {
  try {
    const connection = await pool.getConnection();

    try {
      if (!year && !month) throw new Error(errors.GET_HISTORIES_FAILED.message);
      month = moment(month, 'M').format('MM');

      const [histories] = await connection.query(`
        SELECT *
        FROM histories
        WHERE end_date >= '${year}-${month}-01' AND start_date <= LAST_DAY('${year}-${month}-01')
        ORDER BY id
      `);

      if (!histories) throw new Error(errors.GET_HISTORIES_FAILED.message);

      if (histories.length === 0) {
        return histories;
      } else {
        let query = [];
        histories.forEach(history => {
          query.push(`
            (SELECT player_histories.*, players.known_as, players.birthday, players.position,
            countries.code as country_code, clubs.image as club_image
            FROM player_histories
            LEFT JOIN players ON players.id = player_histories.player_id
            LEFT JOIN countries ON players.country_id = countries.id
            LEFT JOIN clubs ON players.club_id = clubs.id
            WHERE history_id=${history.id}
            LIMIT 5)
          `);
        });
        query = query.join(' union all ');

        const [playerHistories] = await connection.query(query);

        histories.forEach(history => {
          history.players = playerHistories.filter(playerHistory => playerHistory.history_id === history.id);
        });

        return histories;
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

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

module.exports.addHistory = async (historyTerm) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [insertedHistory] = await connection.query(`
        INSERT INTO histories
        (start_date, end_date)
        VALUES (
          '${moment().utc().subtract(historyTerm, 'days').format('YYYY-MM-DD HH:mm:ss')}',
          '${moment().utc().format('YYYY-MM-DD HH:mm:ss')}'
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
