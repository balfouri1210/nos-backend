const pool = require('../database/db-connection');
const { constants, errors } = require('../constants/index');

module.exports.getPlayers = async (
  { previousPlayerIdList, size }
) => {
  try {
    previousPlayerIdList = previousPlayerIdList || '""';
    size = size || 20;

    const [players] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code,
      (players.hits + players.vote_up_count + players.vote_down_count + players.comment_count) as score
      FROM players
      LEFT JOIN countries ON players.nationality = countries.id
      WHERE players.id NOT IN (${previousPlayerIdList.toString()})
      ORDER BY players.hits + players.vote_up_count + players.vote_down_count + players.comment_count DESC, players.id DESC
      LIMIT ${size}
    `);

    return players;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_PLAYERS_FAILED.message);
  }
};

// Heavy인 이유 : player와 연결된 모든것들과 조인하기 때문
module.exports.getHeavyPlayerById = async (
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

    let result = player[0];

    return result;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_PLAYER_BY_ID_FAILED.message);
  }
};

module.exports.increasePlayerHits = async (
  { playerId }
) => {
  try {
    await pool.query(`
      UPDATE players SET hits=hits+1
      WHERE id='${playerId}'
    `);

    return;
  } catch (err) {
    console.error(err);
    throw new Error(errors.INCREASE_PLAYER_HITS_FAILED.message);
  }
};

module.exports.increasePlayerCommentsCount = async (
  playerId, type
) => {
  try {
    let query = type === 'increase' ? 'comment_count+1' : 'comment_count-1';
    await pool.query(`
      UPDATE players SET comment_count=${query}
      WHERE id='${playerId}'
    `);

    return;
  } catch (err) {
    console.error(err);
    throw new Error(errors.INCREASE_PLAYER_HITS_FAILED.message);
  }
};



// 프론트엔드와 단절된 함수들
module.exports.top100PlayersMigrationToHistories = async (historyId) => {
  try {
    const connection = await pool.getConnection();

    try {
      let [top100Players] = await connection.query(`
        SELECT *
        FROM players
        ORDER BY players.hits + players.vote_up_count + players.vote_down_count + players.comment_count DESC, players.id DESC
        LIMIT ${constants.weeklyPlayerHistoryRange}
      `);

      top100Players = top100Players.map(player => {
        return [historyId, player.id, player.hits, player.vote_up_count, player.vote_down_count, player.comment_count];
      });

      await connection.query(`
        INSERT INTO players_histories
        (histories_id, players_id, hits, vote_up_count, vote_down_count, comment_count)
        VALUES ?
      `, [top100Players]);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.initiatePlayers = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Initiate players table
      await connection.query(`
        UPDATE players
        SET vote_up_count=0, vote_down_count=0, hits=0, comment_count=0
      `);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
