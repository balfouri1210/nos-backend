const pool = require('../../database/db-connection');
const { errors } = require('../../constants/index');

module.exports.getPlayers = async ({ searchKeyword, page }) => {
  try {
    const playerPerPage = 20;
    page = page || 1;

    const [players] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code,
      clubs.name as club_name, clubs.image as club_image
      FROM players
      LEFT JOIN countries ON players.country_id = countries.id
      LEFT JOIN clubs ON players.club_team_id = clubs.id
      WHERE players.known_as LIKE '%${searchKeyword || ''}%'
      LIMIT 20
      OFFSET ${playerPerPage * (page - 1)}
    `);

    const [totalPlayerCount] = await pool.query(`
      SELECT COUNT(*) as totalCount
      FROM players
      WHERE players.known_as LIKE '%${searchKeyword || ''}%'
    `);

    if (!players) 
      throw new Error(errors.GET_PLAYERS_FAILED.message);

    return {
      players,
      currentPage: page,
      totalPage: Math.ceil(totalPlayerCount[0]['totalCount'] / playerPerPage)
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.updatePlayer = async ({ playerId, knownAs, birthday, countryId, height, clubTeamId, position, imageUrl }) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Query
      const [updatedPlayer] = await connection.query(`
        UPDATE players SET
        known_as='${knownAs}',
        birthday='${birthday}',
        country_id='${countryId}',
        height='${height}',
        club_team_id='${clubTeamId}',
        position='${position}',
        image_url='${imageUrl}'
        WHERE id='${playerId}'
      `);

      if (!updatedPlayer) {
        throw new Error(errors.UPDATE_PLAYER_FAILED.message);
      }

      return updatedPlayer;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};