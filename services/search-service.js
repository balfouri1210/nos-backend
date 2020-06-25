const pool = require('../database/db-connection');
const { errors, playerScoreSqlGenerator } = require('../constants/index');

module.exports.searchPlayer = async ({ keyword, clubId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      let whereSql;
      if (keyword) {
        whereSql = `WHERE known_as LIKE '%${keyword}%' AND activation=1`;
      } else {
        whereSql = `WHERE club_id='${clubId}' AND activation=1`;
      }

      const [searchResult] = await connection.query(`
        SELECT players.*, clubs.image as club_image, countries.code as country_code,
        ${playerScoreSqlGenerator('players')} as score
        FROM players
        LEFT JOIN clubs ON players.club_id = clubs.id
        LEFT JOIN countries ON players.country_id = countries.id
        ${whereSql}
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
