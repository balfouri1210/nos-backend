const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.searchPlayer = async ({ keyword }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [searchResult] = await connection.query(`
        SELECT players.*, clubs.image as club_image
        FROM players
        LEFT JOIN clubs ON players.club_team_id = clubs.id
        WHERE known_as LIKE '%${keyword}%'
        ORDER BY hits + vote_up_count + vote_down_count + comment_count DESC
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

