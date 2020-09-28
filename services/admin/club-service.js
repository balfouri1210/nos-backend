const pool = require('../../database/db-connection');
const { errors } = require('../../constants/index');

module.exports.getClubs = async ({ leagueId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      let query;
      if (leagueId) {
        query = `SELECT * FROM clubs WHERE league_id='${leagueId}'`;
      } else {
        query = 'SELECT * FROM clubs';
      }
      const [clubs] = await connection.query(query);

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

module.exports.toggleClubActivation = async ({ clubId, activation }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const [updatedClub, updatedPlayers] = await Promise.all([
        connection.query(`
          UPDATE clubs SET
          activation=${activation}
          WHERE id='${clubId}'
        `),

        connection.query(`
          UPDATE players SET
          activation=${activation}
          WHERE club_id='${clubId}'
        `),
      ]);

      if (!updatedClub || !updatedPlayers) throw new Error(errors.UPDATE_CLUB_FAILED.message);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};