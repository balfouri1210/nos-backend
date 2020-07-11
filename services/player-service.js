const pool = require('../database/db-connection');
const { constants, errors, playerScoreSqlGenerator } = require('../constants/index');
const { extractUserInfoFromJWT } = require('./auth-service');
const moment = require('moment');

module.exports.getTotalPlayerCount = async () => {
  try {
    const [totalPlayerCount] = await pool.query(`
      SELECT COUNT(*) as total_player_count
      FROM players
      WHERE activation='1'
    `);

    return totalPlayerCount[0];
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_TOTAL_PLAYER_COUNT_FAILED.message);
  }
};

module.exports.getTopPlayer = async () => {
  try {
    const [totalPlayerCount] = await pool.query(`
      SELECT *, ${playerScoreSqlGenerator('players')} as score
      FROM players
      WHERE activation='1'
      ORDER BY ${playerScoreSqlGenerator('players')} DESC
      LIMIT 1
    `);

    return totalPlayerCount[0];
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_TOTAL_PLAYER_COUNT_FAILED.message);
  }
};

module.exports.getPlayers = async ({ previousPlayerIdList, size }) => {
  try {
    const connection = await pool.getConnection();

    try {
      previousPlayerIdList = previousPlayerIdList || '""';
      size = size || 20;

      const [players] = await connection.query(`
        SELECT players.*, countries.name as country_name, countries.code as country_code,
        ${playerScoreSqlGenerator('players')} as score, clubs.image as club_image
        FROM players
        LEFT JOIN countries ON players.country_id = countries.id
        LEFT JOIN clubs ON players.club_id = clubs.id
        WHERE players.id NOT IN (${previousPlayerIdList}) AND activation='1'
        ORDER BY ${playerScoreSqlGenerator('players')} DESC, rand()
        LIMIT ${size}
      `);

      return players;
    } finally {
      connection.release();
    }
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
      clubs.clean_name as club_name, clubs.image as club_image,
      leagues.id as league_id,
      player_vote_histories.vote as vote,
      ${playerScoreSqlGenerator('players')} as score
      FROM players
      LEFT JOIN countries ON players.country_id = countries.id
      LEFT JOIN clubs ON players.club_id = clubs.id
      LEFT JOIN leagues ON clubs.league_id = leagues.id
      LEFT JOIN player_vote_histories ON player_vote_histories.user_id = ${userId} AND player_vote_histories.player_id = ${playerId}
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

module.exports.mutatePlayerCommentsCount = async (
  playerId, type
) => {
  try {
    if (type === 'increase') {
      await pool.query(`
        UPDATE players SET comment_count=comment_count+1, last_commented_at='${moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')}'
        WHERE id='${playerId}'
      `);
    } else {
      await pool.query(`
        UPDATE players SET comment_count=comment_count-1
        WHERE id='${playerId}'
      `);
    }

    return;
  } catch (err) {
    console.error(err);
    throw new Error(errors.MUTATE_PLAYER_COMMENT_COUNT_FAILED.message);
  }
};



// 프론트엔드와 단절된 함수들
module.exports.top100PlayersMigrationToHistories = async (historyId) => {
  try {
    const connection = await pool.getConnection();

    try {
      let [targetPlayerList] = await connection.query(`
        SELECT *
        FROM players
        WHERE activation='1' AND ${playerScoreSqlGenerator('players')} > 0
        ORDER BY ${playerScoreSqlGenerator('players')} DESC, players.id DESC
        LIMIT ${constants.weeklyPlayerHistoryRange}
      `);

      const topPlayer = targetPlayerList[0];
      const topPlayerScore = Math.round(topPlayer.hits/2)
      + topPlayer.comment_count
      + topPlayer.vote_up_count
      + topPlayer.vote_down_count
      + topPlayer.vote_question_count
      + topPlayer.vote_fire_count
      + topPlayer.vote_celebration_count
      + topPlayer.vote_strong_count
      + topPlayer.vote_alien_count
      + topPlayer.vote_battery_high_count
      + topPlayer.vote_battery_medium_count
      + topPlayer.vote_battery_low_count
      + topPlayer.vote_battery_off_count
      + topPlayer.vote_bomb_count
      + topPlayer.vote_angry_count
      + topPlayer.vote_hmm_count
      + topPlayer.vote_cool_count
      + topPlayer.vote_sad_count
      + topPlayer.vote_lol_count
      + topPlayer.vote_poop_count;

      const top100Players = targetPlayerList.map(player => {
        return [
          historyId,
          player.id,
          player.hits,
          player.comment_count,
          player.vote_up_count, player.vote_down_count, player.vote_question_count,
          player.vote_fire_count, player.vote_celebration_count, player.vote_strong_count,
          player.vote_alien_count, player.vote_battery_high_count, player.vote_battery_medium_count,
          player.vote_battery_low_count, player.vote_battery_off_count, player.vote_bomb_count,
          player.vote_angry_count, player.vote_hmm_count, player.vote_cool_count,
          player.vote_sad_count, player.vote_lol_count, player.vote_poop_count
        ];
      });

      await Promise.all([
        connection.query(`
          INSERT INTO player_histories
          (history_id, player_id, hits, comment_count,
          vote_up_count, vote_down_count, vote_question_count,
          vote_fire_count, vote_celebration_count, vote_strong_count,
          vote_alien_count, vote_battery_high_count, vote_battery_medium_count,
          vote_battery_low_count, vote_battery_off_count, vote_bomb_count,
          vote_angry_count, vote_hmm_count, vote_cool_count,
          vote_sad_count, vote_lol_count, vote_poop_count)
          VALUES ?
        `, [top100Players]),

        connection.query(`
          UPDATE histories
          SET top_player_score='${topPlayerScore}'
          WHERE id='${historyId}'
        `)
      ]);

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
        SET hits=0, comment_count=0, last_commented_at=0,
        vote_up_count=0, vote_down_count=0, vote_question_count=0,
        vote_fire_count=0, vote_celebration_count=0, vote_strong_count=0,
        vote_alien_count=0, vote_battery_high_count=0, vote_battery_medium_count=0,
        vote_battery_low_count=0, vote_battery_off_count=0, vote_bomb_count=0,
        vote_angry_count=0, vote_hmm_count=0, vote_cool_count=0,
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
