const pool = require('../database/db-connection');
const { errors, playerScoreSqlGenerator } = require('../constants/index');

module.exports.searchPlayer = async ({ keyword, clubId, countryId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      let whereSql = '';
      let limitSql = '';
      if (keyword) {
        whereSql = `WHERE known_as LIKE '%${keyword}%' AND players.activation=1`;
      } else if (clubId) {
        whereSql = `WHERE club_id='${clubId}' AND players.activation=1`;
      } else if (countryId) {
        whereSql = `WHERE players.country_id='${countryId}' AND players.activation=1`;
      } else {
        limitSql = 'LIMIT 50';
      }

      const [searchResult] = await connection.query(`
        SELECT players.*, clubs.image as club_image, countries.code as country_code,
        ${playerScoreSqlGenerator('players')} as score
        FROM players
        LEFT JOIN clubs ON players.club_id = clubs.id
        LEFT JOIN countries ON players.country_id = countries.id
        ${whereSql}
        ORDER BY ${playerScoreSqlGenerator('players')} DESC
        ${limitSql}
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
