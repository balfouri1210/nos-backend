const pool = require('../../database/db-connection');
const { errors, constants } = require('../../constants/index');

module.exports.getTotalCommentsHistoryCount = async ({ historyId }) => {
  try {
    const [totalCommentsCount, totalHotCommentsCount] = await Promise.all([
      pool.query(`
        SELECT COUNT(*) AS COUNT
        FROM player_comment_histories
        WHERE history_id = ${historyId}
      `),

      pool.query(`
        SELECT COUNT(*) AS COUNT
        FROM player_comment_histories
        WHERE history_id = ${historyId} AND vote_up_count >= ${constants.hotCommentVoteCriteria}
      `)
    ]);

    return {
      totalCommentsCount: totalCommentsCount[0][0].COUNT,
      totalHotCommentsCount: totalHotCommentsCount[0][0].COUNT
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getPlayerCommentsHistoryPreviewByHistoryId = async ({historyId}, { playerIdList, count }) => {
  try {
    const connection = await pool.getConnection();

    try {
      if (playerIdList) {
        playerIdList = playerIdList.split(',');
        let query = [];
  
        playerIdList.forEach(playerId => {
          query.push(`
            (SELECT player_comment_histories.*, users.username
            FROM player_comment_histories
            LEFT JOIN users ON player_comment_histories.user_id=users.id
            WHERE history_id=${historyId} AND player_id=${playerId}
            ORDER BY (player_comment_histories.vote_up_count - player_comment_histories.vote_down_count) DESC, player_comment_histories.id DESC
            LIMIT ${ count || 3 })
          `);
        });
        query = query.join(' union all ');
  
        const [playerCommentsHistories] = await connection.query(query);
  
        return playerCommentsHistories;
      } else {
        return 'No player id list';
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_COMMENTS_HISTORIES_FAILED.message);
  }
};

module.exports.getWholePlayerCommentsHistoryByHistoryId = async (
  { historyId },
  { sortType = 'date', commentsPerRequest = 20, page = 1 }
) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      let query;
      const commonQuery = `SELECT user_id, player_comment_histories.content, player_comment_histories.created_at,
        player_comment_histories.reply_count, player_comment_histories.vote_up_count,
        players.id as player_id, players.known_as as player_name, clubs.image as club_image
        FROM player_comment_histories
        LEFT JOIN players ON players.id = player_comment_histories.player_id
        LEFT JOIN clubs ON clubs.id = players.club_id`;

      switch (sortType) {
      case 'date':
      default :
        query = `
          ${commonQuery}
          WHERE history_id = ${historyId}
          ORDER BY player_comment_histories.id DESC
          LIMIT ${commentsPerRequest}
          OFFSET ${commentsPerRequest * (page - 1)}
        `;
        break;

      case 'vote':
        query = `
          ${commonQuery}
          WHERE history_id = ${historyId} AND player_comment_histories.vote_up_count >= ${constants.hotCommentVoteCriteria}
          ORDER BY player_comment_histories.best_commented_at DESC
          LIMIT ${commentsPerRequest}
          OFFSET ${commentsPerRequest * (page - 1)}
        `;
        break;
      }

      const [comments] = await connection.query(query);

      return comments;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_COMMENTS_HISTORIES_FAILED.message);
  }
};

module.exports.getPlayerCommentsHistoriesByPlayerId = async (
  { historyId, playerId },
  { sortType, minId, previousCommentIdList }
  // minId: date 정렬일 때 페이징 처리를 위한 변수
  // minPoint : upvote - downvote 정렬일 때 페이징 처리를 위한 변수 
  // previousCommentIdList : upvote - downvote 정렬일 때 이미 로드된 댓글들의 아이디 목록 (걔네를 제외하고 검색해야 하기 때문)
) => {
  try {
    const connection = await pool.getConnection();

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
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_COMMENTS_HISTORIES_FAILED.message);
  }
};
