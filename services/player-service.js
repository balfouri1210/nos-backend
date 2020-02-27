const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getPlayers = async (
  { previousPlayerIdList }
) => {
  try {
    const howManyPlayersEachRequest = 20;
    previousPlayerIdList = previousPlayerIdList || '""';
    const [players] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code FROM players
      LEFT JOIN countries ON players.nationality = countries.id
      WHERE players.id NOT IN (${previousPlayerIdList.toString()})
      ORDER BY players.id
      LIMIT ${howManyPlayersEachRequest}
    `);

    return players;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_REPLY_FAILED.message);
  }
};