const pool = require('../database/db-connection');
const { errors, playerScoreSqlGenerator } = require('../constants/index');
const moment = require('moment');

module.exports.getLatestHistoryId = async() => {
  try {
    const connection = await pool.getConnection();

    try {
      const [history] = await connection.query(`
        SELECT MAX(id) as latest_history_id FROM histories
      `);

      if (!history) {
        throw new Error(errors.GET_LATEST_HISTORY_ID_FAILED.message);
      }

      return history[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getHistories = async ({ year, month }) => {
  try {
    const connection = await pool.getConnection();

    try {
      if (!year && !month) throw new Error(errors.GET_HISTORIES_FAILED.message);
      month = moment(month, 'M').format('MM');

      const [histories] = await connection.query(`
        SELECT *
        FROM histories
        WHERE end_date >= '${year}-${month}-01' AND start_date <= LAST_DAY('${year}-${month}-01')
        ORDER BY id
      `);

      if (!histories) throw new Error(errors.GET_HISTORIES_FAILED.message);

      if (histories.length === 0) {
        return histories;
      } else {
        let query = [];
        histories.forEach(history => {
          query.push(`
            (SELECT player_histories.*, players.known_as, players.birthday, players.position,
            countries.code as country_code, clubs.image as club_image
            FROM player_histories
            LEFT JOIN players ON players.id = player_histories.player_id
            LEFT JOIN countries ON players.country_id = countries.id
            LEFT JOIN clubs ON players.club_id = clubs.id
            WHERE history_id=${history.id}
            LIMIT 5)
          `);
        });
        query = query.join(' union all ');

        const [playerHistories] = await connection.query(query);

        histories.forEach(history => {
          history.players = playerHistories.filter(playerHistory => playerHistory.history_id === history.id);
        });

        return histories;
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getHistory = async ({ historyId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [histories] = await connection.query(`
        SELECT *
        FROM histories
        WHERE id='${historyId}'
      `);

      if (!histories) {
        throw new Error(errors.GET_HISTORIES_FAILED.message);
      }

      return histories[0];
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.addHistories = async (historyTerm) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [insertedHistory] = await connection.query(`
        INSERT INTO histories
        (start_date, end_date)
        VALUES (
          '${moment().utc().subtract(historyTerm, 'days').format('YYYY-MM-DD HH:mm:ss')}',
          '${moment().utc().format('YYYY-MM-DD HH:mm:ss')}'
        )
      `);

      if (!insertedHistory) throw new Error(errors.REGISTER_HISTORY_FAILED.message);

      return insertedHistory.insertId;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

// 프론트에서 history페이지 player list의 infinite scroll을 제어하기 위함.
module.exports.getTotalPlayersOfHistory = async ({ historyId }) => {
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

module.exports.getPlayerHistories = async ({ historyId }, { previousPlayerIdList }) => {
  try {
    const connection = await pool.getConnection();
    previousPlayerIdList = previousPlayerIdList || '""';

    try {
      const [playerHistories] = await connection.query(`
        SELECT player_histories.hits, player_histories.vote_up_count, player_histories.vote_down_count, player_histories.comment_count,
        ${playerScoreSqlGenerator('player_histories')} AS score,
        players.id, players.known_as, players.birthday, players.country_id, players.height, players.club_id, players.position, image_url,
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
        ORDER BY ${playerScoreSqlGenerator('player_histories')} DESC
        LIMIT 20
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

module.exports.getPlayerCommentsHistoryPreview = async ({historyId}, { playerIdList }) => {
  try {
    const connection = await pool.getConnection();

    try {
      playerIdList = playerIdList.split(',');
      let query = [];

      playerIdList.forEach(playerId => {
        query.push(`
          (SELECT player_comment_histories.*, users.username
          FROM player_comment_histories
          LEFT JOIN users ON player_comment_histories.user_id=users.id
          WHERE history_id=${historyId} AND player_id=${playerId}
          ORDER BY (player_comment_histories.vote_up_count - player_comment_histories.vote_down_count) DESC, player_comment_histories.id DESC
          LIMIT 3)
        `);
      });
      query = query.join(' union all ');

      const [playerCommentsHistories] = await connection.query(query);

      return playerCommentsHistories;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_COMMENTS_HISTORIES_FAILED.message);
  }
};



// Player modal 에서 쓰이는 함수들
module.exports.getPlayerHistory = async ({ historyId, playerId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [playerHistory] = await connection.query(`
        SELECT player_histories.*, players.id,
        players.known_as, players.birthday, players.height, players.club_id, players.position, players.image_url,
        ${playerScoreSqlGenerator('player_histories')} AS score,
        (SELECT COUNT(*)+1 FROM player_histories WHERE history_id='${historyId}' AND score < ${playerScoreSqlGenerator('player_histories')}) AS ranking,
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

module.exports.getPlayerCommentsHistories = async (
  { historyId, playerId },
  { sortType, minId, previousCommentIdList }
  // minId: date 정렬일 때 페이징 처리를 위한 변수
  // minPoint : upvote - downvote 정렬일 때 페이징 처리를 위한 변수 
  // previousCommentIdList : upvote - downvote 정렬일 때 이미 로드된 댓글들의 아이디 목록 (걔네를 제외하고 검색해야 하기 때문)
) => {
  try {
    const table = 'player_comment_histories';
    const howManyCommentEachRequest = 10;

    // 최초 로드시 minId가 없으므로 최대값으로 설정하여 가장 큰 id를 가진 comment부터 가져오도록 한다.
    minId = minId || 2147483647;
    // 최초 로드시 comment list가 존재하지 않으므로 빈값을 할당한다.
    previousCommentIdList = previousCommentIdList || '""';

    let orderByQuery, whereQuery;
    switch (sortType) {
    case 'date' :
      orderByQuery = `${table}.id DESC`;
      whereQuery = `history_id='${historyId}' AND player_id='${playerId}' AND ${table}.id < ${minId}`;
      break;

    case 'like' :
    default :
      orderByQuery = `(${table}.vote_up_count - ${table}.vote_down_count) DESC, ${table}.id DESC`;
      whereQuery = `history_id='${historyId}' AND player_id='${playerId}' AND ${table}.id NOT IN (${previousCommentIdList})`;
      break;
    }

    const [comments] = await pool.query(`
      SELECT ${table}.id, ${table}.user_id, ${table}.created_at, ${table}.fake_username,
      content, vote_up_count, vote_down_count, username, reply_count
      FROM ${table}
      LEFT JOIN users ON ${table}.user_id = users.id
      WHERE ${whereQuery}
      ORDER BY ${orderByQuery}
      LIMIT ${howManyCommentEachRequest}`
    );

    return comments;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_COMMENTS_HISTORIES_FAILED.message);
  }
};

module.exports.getPlayerRepliesHistories = async (
  { historyId },
  { maxId, parentCommentId }
) => {
  try {
    const table = 'player_reply_histories';
    const howManyReplyEachRequest = 10;
    maxId = maxId || 0;

    const [replies] = await pool.query(`
      SELECT ${table}.id, ${table}.user_id, username, content, parent_comment_id, vote_up_count, vote_down_count,
      ${table}.created_at FROM ${table}
      LEFT JOIN users ON ${table}.user_id = users.id
      WHERE history_id=${historyId} AND parent_comment_id=${parentCommentId} AND ${table}.id>${maxId}
      ORDER BY ${table}.id
      LIMIT ${howManyReplyEachRequest}
    `);

    return replies;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_REPLIES_HISTORIES_FAILED.message);
  }
};