const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getPlayerCommentByPlayerId = async ({ playerId }) => {
  try {
    const table = 'player_comments';
    const [rows] = await pool.query(`
      SELECT ${table}.id, ${table}.user_id, ${table}.created_at, content, vote_up, vote_down, username, child_comment_count FROM ${table}
      LEFT JOIN users ON ${table}.user_id = users.id
      WHERE player_id='${playerId}'
      ORDER BY ${table}.id DESC LIMIT 10`
    );
    return rows;
  } catch (err) {
    throw new Error(errors.GET_COMMENT_FAILED.message);
  }
};

module.exports.addPlayerComment = async ({ userId, playerId, content }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const insertSql = 'INSERT INTO player_comments (user_id, player_id, content) VALUES (?, ?, ?)';
      const params = [userId, playerId, content];
      const [createdComment] = await connection.query(insertSql, params);

      if (!createdComment) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      return {
        id: createdComment.insertId
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message || err);
  }
};
