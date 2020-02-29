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
    throw new Error(errors.GET_PLAYERS_FAILED.message);
  }
};

module.exports.getPlayerByID = async (
  { playerId }
) => {
  try {
    const [player] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code,
      clubs.name as club_name, clubs.image as club_image,
      leagues.id as league_id
      FROM players
      LEFT JOIN countries ON players.nationality = countries.id
      LEFT JOIN clubs ON players.club_team_id = clubs.id
      LEFT JOIN leagues ON clubs.leagues_id = leagues.id
      WHERE players.id = ${playerId}
    `);

    return player[0];
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_PLAYER_BY_ID_FAILED.message);
  }
};