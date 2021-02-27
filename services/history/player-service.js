const pool = require('../../database/db-connection');
const { errors, playerScoreSqlGenerator } = require('../../constants/index');

// 프론트에서 history페이지 player list의 총 선수 수를 알기 위함.
module.exports.getTotalPlayerCountByHistoryId = async ({ historyId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [totalPlayerCount] = await connection.query(`
        SELECT COUNT(*) as total_player_count
        FROM player_histories
        WHERE history_id='${historyId}'
      `);

      return totalPlayerCount[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_TOTAL_PLAYER_COUNT_FAILED.message);
  }
};

module.exports.getPlayerListByHistoryId = async ({ historyId }, { previousPlayerIdList, count }) => {
  try {
    const connection = await pool.getConnection();
    previousPlayerIdList = previousPlayerIdList || '""';
    count = count || 20;

    try {
      const [playerHistories] = await connection.query(`
        SELECT player_histories.hits, player_histories.vote_up_count, player_histories.vote_down_count, player_histories.comment_count,
        ${playerScoreSqlGenerator('player_histories')} AS score,
        players.id, players.known_as, players.birthday, players.country_id, players.height, players.club_id, players.position, image_url,
        countries.id AS country_id,
        countries.name AS country_name,
        countries.code AS country_code,
        clubs.image AS club_image,
        clubs.color AS club_color
        FROM player_histories
        LEFT JOIN players ON player_histories.player_id = players.id
        LEFT JOIN countries ON players.country_id = countries.id
        LEFT JOIN clubs ON players.club_id = clubs.id
        WHERE history_id='${historyId}' AND
        players.id NOT IN (${previousPlayerIdList})
        ORDER BY player_histories.id
        LIMIT ${count}
      `);

      if (!playerHistories) {
        throw new Error(errors.GET_HISTORIES_FAILED.message);
      }

      return playerHistories;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

// Player modal 에서 쓰이는 함수들
module.exports.getPlayerHistoryByHistoryId = async ({ historyId, playerId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [playerHistory] = await connection.query(`
        SELECT player_histories.*, players.id,
        players.known_as, players.birthday, players.height, players.club_id, players.position, players.image_url,
        ${playerScoreSqlGenerator('player_histories')} AS score,
        (SELECT COUNT(*)+1 FROM player_histories WHERE history_id='${historyId}' AND score < ${playerScoreSqlGenerator('player_histories')}) AS ranking,
        countries.id AS country_id,
        countries.name AS country_name,
        countries.code AS country_code,
        clubs.name AS club_name,
        clubs.color AS club_color,
        clubs.image AS club_image,
        leagues.id AS league_id,
        histories.top_player_score AS top_player_score
        FROM player_histories
        LEFT JOIN players ON player_histories.player_id = players.id
        LEFT JOIN countries ON players.country_id = countries.id
        LEFT JOIN clubs ON players.club_id = clubs.id
        LEFT JOIN leagues ON clubs.league_id = leagues.id
        LEFT JOIN histories ON player_histories.history_id = histories.id
        WHERE history_id='${historyId}' AND player_id='${playerId}'
      `);

      if (!playerHistory) {
        throw new Error(errors.GET_HISTORIES_FAILED.message);
      }

      return playerHistory[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
