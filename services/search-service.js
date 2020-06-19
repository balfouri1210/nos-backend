const pool = require('../database/db-connection');
const { errors, playerScoreSqlGenerator } = require('../constants/index');

module.exports.searchPlayer = async ({ keyword }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [searchResult] = await connection.query(`
        SELECT players.*, clubs.image as club_image, countries.code as country_code
        FROM players
        LEFT JOIN clubs ON players.club_id = clubs.id
        LEFT JOIN countries ON players.country_id = countries.id
        WHERE known_as LIKE '%${keyword}%'
        ORDER BY ${playerScoreSqlGenerator('players')} DESC
      `);

      if (!searchResult) {
        throw new Error(errors.SEARCH_PLAYER_FAILED.message);
      }

      return searchResult;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.searchPlayerByClub = async ({ clubId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Initiate players table
      const [players] = await connection.query(`
        SELECT players.*, countries.name as country_name, countries.code as country_code,
        clubs.image as club_image
        FROM players
        LEFT JOIN clubs ON players.club_id = clubs.id
        LEFT JOIN countries ON players.country_id = countries.id
        WHERE club_id='${clubId}' AND activation='1'
        ORDER BY ${playerScoreSqlGenerator('players')} DESC, rand()
      `);

      if (!players) {
        throw new Error(errors.GET_PLAYERS_FAILED.message);
      }

      return players;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};