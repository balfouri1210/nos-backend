const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const axios = require('axios');

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

module.exports.getClubStandings = async ({ leagueId }) => {
  try {
    if (!leagueId) throw new Error(errors.GET_CLUB_STANDINGS_FAILED.message);

    // Initiate players table
    const { data } = await axios.get(`${process.env.API_FOOTBALL_API_URL}/leagueTable/${leagueId}`, {
      headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY
      }
    });

    if (!data)
      throw new Error(errors.GET_CLUB_STANDINGS_FAILED.message);

    return data.api.standings;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
