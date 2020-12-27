const pool = require('../../database/db-connection');
const { errors } = require('../../constants/index');

module.exports.getPlayerReplyHistoriesByHistoryId = async (
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