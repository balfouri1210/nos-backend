const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getClubs = async ({ leagueId }) => {
  try {
    if (!leagueId)
      throw new Error(errors.GET_CLUBS_FAILED.message);

    const connection = await pool.getConnection();

    try {
      // Initiate players table
      const [clubs] = await connection.query(`
        SELECT *
        FROM clubs
        WHERE league_id='${leagueId}'
      `);

      if (!clubs) 
        throw new Error(errors.GET_CLUBS_FAILED.message);

      return clubs;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};