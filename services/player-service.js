const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getPlayers = async (
  authorization,
  { parentCommentsId },
  { maxId }
) => {
  try {
    const howManyPlayersEachRequest = 10;
    maxId = maxId || 0;
    const [players] = await pool.query(`
      SELECT ${targetOpinion}.id, ${targetOpinion}.users_id, username, content, parent_comments_id, vote_up_count, vote_down_count, ${targetOpinion}.created_at FROM ${targetOpinion}
      LEFT JOIN users ON ${targetOpinion}.users_id = users.id
      WHERE parent_comments_id=${parentCommentsId} AND ${targetOpinion}.id>${maxId}
      ORDER BY ${targetOpinion}.id
      LIMIT ${howManyReplyEachRequest}
    `);

    return players;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_REPLY_FAILED.message);
  }
};