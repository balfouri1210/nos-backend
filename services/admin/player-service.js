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
      LEFT JOIN clubs ON players.club_id = clubs.id
      WHERE players.known_as LIKE '%${searchKeyword || ''}%'
      LIMIT ${playerPerPage}
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

module.exports.getPlayersByClub = async ({ clubId }) => {
  try {
    const [players] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code,
      clubs.name as club_name, clubs.image as club_image
      FROM players
      LEFT JOIN countries ON players.country_id = countries.id
      LEFT JOIN clubs ON players.club_id = clubs.id
      WHERE players.club_id=${clubId}
    `);

    if (!players) 
      throw new Error(errors.GET_PLAYERS_FAILED.message);

    return players;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.updatePlayer = async ({ playerId, knownAs, birthday, countryId, height, clubId, position, imageUrl, apifootballPlayerId }) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      knownAs = knownAs.replace(/'/g, "\\'");

      // Query
      const [updatedPlayer] = await connection.query(`
        UPDATE players SET
        known_as='${knownAs}',
        birthday='${birthday}',
        country_id='${countryId}',
        height='${height}',
        club_id='${clubId}',
        position='${position}',
        image_url='${imageUrl}',
        apifootball_player_id='${apifootballPlayerId}'
        WHERE id='${playerId}'
      `);

      if (!updatedPlayer) throw new Error(errors.UPDATE_PLAYER_FAILED.message);

      return updatedPlayer;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.togglePlayerActivation = async ({ playerId, activation }) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Query
      const [updatedPlayer] = await connection.query(`
        UPDATE players SET
        activation=${activation}
        WHERE id='${playerId}'
      `);

      if (!updatedPlayer) throw new Error(errors.UPDATE_PLAYER_FAILED.message);

      return updatedPlayer;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.createPlayer = async ({
  knownAs,
  birthday,
  countryId,
  height,
  clubId,
  position,
  imageUrl,
  apifootballPlayerId
}) => {
  try {
    if (!(knownAs && birthday && countryId && height && clubId && position))
      throw new Error(errors.CREATE_PLAYER_FAILED.message);

    const connection = await pool.getConnection();
    
    try {
      // Query
      const insertSql = `
        INSERT INTO players (known_as, birthday, country_id, height, club_id, position, image_url, apifootball_player_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [knownAs, birthday, countryId, height, clubId, position, imageUrl, apifootballPlayerId];
      const [createdPlayer] = await connection.query(insertSql, params);

      if (!createdPlayer) throw new Error(errors.CREATE_PLAYER_FAILED.message);

      return createdPlayer;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.deletePlayer = async ({ playerId }) => {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Query
      const [deletedPlayer] = await connection.query(`
        DELETE FROM players
        WHERE id='${playerId}'
      `);

      if (!deletedPlayer) throw new Error(errors.DELETE_PLAYER_FAILED.message);

      return deletedPlayer;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};