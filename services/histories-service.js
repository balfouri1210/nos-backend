const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const moment = require('moment');

module.exports.getHistories = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      const [histories] = await connection.query(`
        SELECT *
        FROM histories
        ORDER BY id DESC
      `);

      if (!histories) {
        throw new Error(errors.GET_HISTORIES_FAILED.message);
      }

      return histories;
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
      const date = new Date();

      const [insertedHistory] = await connection.query(`
        INSERT INTO histories
        (start_date, end_date)
        VALUES (
          '${moment(new Date(date.getTime() - historyTerm)).utc().format('YYYY-MM-DD HH:mm:ss')}',
          '${moment(date).utc().format('YYYY-MM-DD HH:mm:ss')}'
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

module.exports.getPlayerHistories = async ({ historyId }, { previousPlayerIdList }) => {
  try {
    const connection = await pool.getConnection();
    previousPlayerIdList = previousPlayerIdList || '""';

    try {
      const [playerHistories] = await connection.query(`
        SELECT players_histories.hits, players_histories.vote_up_count, players_histories.vote_down_count, players_histories.comment_count,
        (players_histories.hits + players_histories.vote_up_count + players_histories.vote_down_count + players_histories.comment_count) as score,
        players.id, players.known_as, players.birthday, players.nationality, players.height, players.club_team_id, players.position,
        countries.name as country_name, countries.code as country_code
        FROM players_histories
        LEFT JOIN players ON players_histories.players_id = players.id
        LEFT JOIN countries ON players.nationality = countries.id
        WHERE histories_id='${historyId}' AND
        players.id NOT IN (${previousPlayerIdList.toString()})
        ORDER BY players_histories.hits + players_histories.vote_up_count + players_histories.vote_down_count + players_histories.comment_count DESC
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


// Player modal 에서 쓰이는 함수들
module.exports.getPlayerHistory = async ({ historyId, playerId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [playerHistory] = await connection.query(`
        SELECT players.id, players_histories.histories_id, players_histories.hits, players_histories.vote_up_count, players_histories.vote_down_count, players_histories.comment_count,
        players.known_as, players.birthday, players.height, players.club_team_id, players.position, players.image_url,
        countries.name as country_name, countries.code as country_code,
        clubs.name as club_name, clubs.image as club_image,
        leagues.id as league_id
        FROM players_histories
        LEFT JOIN players ON players_histories.players_id = players.id
        LEFT JOIN countries ON players.nationality = countries.id
        LEFT JOIN clubs ON players.club_team_id = clubs.id
        LEFT JOIN leagues ON clubs.leagues_id = leagues.id
        WHERE histories_id='${historyId}' AND players_id='${playerId}'
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
    const table = 'player_comments_histories';
    const howManyCommentEachRequest = 10;

    // 최초 로드시 minId가 없으므로 최대값으로 설정하여 가장 큰 id를 가진 comment부터 가져오도록 한다.
    minId = minId || 2147483647;
    // 최초 로드시 comment list가 존재하지 않으므로 빈값을 할당한다.
    previousCommentIdList = previousCommentIdList || '""';

    let orderByQuery, whereQuery;
    switch (sortType) {
    case 'date' :
      orderByQuery = `${table}.id DESC`;
      whereQuery = `histories_id='${historyId}' AND players_id='${playerId}' AND ${table}.id < ${minId}`;
      break;

    case 'like' :
    default :
      orderByQuery = `(${table}.vote_up_count - ${table}.vote_down_count) DESC, ${table}.id DESC`;
      whereQuery = `histories_id='${historyId}' AND players_id='${playerId}' AND ${table}.id NOT IN (${previousCommentIdList.toString()})`;
      break;
    }

    const [comments] = await pool.query(`
      SELECT ${table}.id, ${table}.users_id, ${table}.created_at,
      content, vote_up_count, vote_down_count, username, reply_count
      FROM ${table}
      LEFT JOIN users ON ${table}.users_id = users.id
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
  { maxId, parentCommentsId }
) => {
  try {
    const table = 'player_replies_histories';
    const howManyReplyEachRequest = 10;
    maxId = maxId || 0;

    const [replies] = await pool.query(`
      SELECT ${table}.id, ${table}.users_id, username, content, parent_comments_id, vote_up_count, vote_down_count,
      ${table}.created_at FROM ${table}
      LEFT JOIN users ON ${table}.users_id = users.id
      WHERE histories_id=${historyId} AND parent_comments_id=${parentCommentsId} AND ${table}.id>${maxId}
      ORDER BY ${table}.id
      LIMIT ${howManyReplyEachRequest}
    `);

    return replies;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_REPLIES_HISTORIES_FAILED.message);
  }
};