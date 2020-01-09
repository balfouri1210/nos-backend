const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getPlayerChildCommentByParentId = async ({ parentId }) => {
  try {
    const table = 'player_child_comments';
    const [rows] = await pool.query(`
      SELECT ${table}.id, ${table}.created_at, content, vote_up, vote_down, username FROM ${table}
      LEFT JOIN users ON ${table}.user_id = users.id
      WHERE parent_id='${parentId}'
      ORDER BY ${table}.id DESC LIMIT 10`
    );
    return rows;
  } catch (err) {
    throw new Error(errors.GET_COMMENT_FAILED.message);
  }
};

module.exports.addPlayerChildComment = async ({ userId, playerId, content, parentId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const insertSql = 'INSERT INTO player_child_comments (user_id, player_id, content, parent_id) VALUES (?, ?, ?, ?)';
      const params = [userId, playerId, content, parentId];
      const [createdComment] = await connection.query(insertSql, params);

      if (!createdComment) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      await pool.query(`UPDATE player_comments SET child_comment_count=child_comment_count+1 WHERE id='${parentId}'`);

      return {
        id: createdComment.insertId
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

