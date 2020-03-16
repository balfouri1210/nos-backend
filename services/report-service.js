const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const { extractUserInfoFromJWT } = require('./auth-service');

module.exports.reportOpinion = async (authorization, { type, subject, targetId }) => {
  // type = comment or reply
  // subject = player of team
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      // Add report
      const [createdResult] = await connection.query(`
        INSERT INTO ${type}_reports (subject, target_id, reporter_id)
        VALUES (?, ?, ?)
      `, [subject, targetId, userId]);

      if (!createdResult) {
        throw new Error(errors.CREATE_REPORT_FAIL.message);
      }

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};