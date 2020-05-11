const pool = require('../database/db-connection');
const { constants, errors, getPlayerScoreSql } = require('../constants/index');
const { extractUserInfoFromJWT } = require('./auth-service');

module.exports.getPlayers = async (
  { previousPlayerIdList, size }
) => {
  try {
    previousPlayerIdList = previousPlayerIdList || '""';
    size = size || 20;

    const [players] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code,
      ${getPlayerScoreSql} as score
      FROM players
      LEFT JOIN countries ON players.country_id = countries.id
      WHERE players.id NOT IN (${previousPlayerIdList.toString()})
      ORDER BY ${getPlayerScoreSql} DESC, players.id DESC
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
  authorization,
  { playerId }
) => {
  const { userId } = extractUserInfoFromJWT(authorization);

  try {
    const [player] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code,
      clubs.name as club_name, clubs.image as club_image,
      leagues.id as league_id,
      players_vote_histories.vote as vote
      FROM players
      LEFT JOIN countries ON players.country_id = countries.id
      LEFT JOIN clubs ON players.club_team_id = clubs.id
      LEFT JOIN leagues ON clubs.leagues_id = leagues.id
      LEFT JOIN players_vote_histories ON players_vote_histories.users_id = ${userId} AND players_vote_histories.players_id = ${playerId}
      WHERE players.id = ${playerId}
    `);

    return player[0];
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
        ORDER BY ${getPlayerScoreSql} DESC, players.id DESC
        LIMIT ${constants.weeklyPlayerHistoryRange}
      `);

      top100Players = top100Players.map(player => {
        return [
          historyId,
          player.id,
          player.hits,
          player.comment_count,
          player.vote_up_count, player.vote_down_count, player.vote_question_count,
          player.vote_fire_count, player.vote_celebration_count, player.vote_strong_count,
          player.vote_alien_count, player.vote_battery_high_count, player.vote_battery_medium_count,
          player.vote_battery_low_count, player.vote_battery_off_count, player.vote_bomb_count,
          player.vote_angry_count, player.vote_doubt_count, player.vote_cool_count,
          player.vote_sad_count, player.vote_lol_count, player.vote_poop_count
        ];
      });

      await connection.query(`
        INSERT INTO players_histories
        (histories_id, players_id, hits, comment_count,
        vote_up_count, vote_down_count, vote_question_count,
        vote_fire_count, vote_celebration_count, vote_strong_count,
        vote_alien_count, vote_battery_high_count, vote_battery_medium_count,
        vote_battery_low_count, vote_battery_off_count, vote_bomb_count,
        vote_angry_count, vote_doubt_count, vote_cool_count,
        vote_sad_count, vote_lol_count, vote_poop_count)
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
        SET hits=0, comment_count=0,
        vote_up_count=0, vote_down_count=0, vote_question_count=0,
        vote_fire_count=0, vote_celebration_count=0, vote_strong_count=0,
        vote_alien_count=0, vote_battery_high_count=0, vote_battery_medium_count=0,
        vote_battery_low_count=0, vote_battery_off_count=0, vote_bomb_count=0,
        vote_angry_count=0, vote_doubt_count=0, vote_cool_count=0,
        vote_sad_count=0, vote_lol_count=0, vote_poop_count=0
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
