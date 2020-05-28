const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const { extractUserInfoFromJWT } = require('./auth-service');

module.exports.reportOpinion = async (authorization, { object, targetId, reason }) => {
  // type = comment or reply
  // subject = player of team
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      // Check already reported
      const [reportedOpinion] = await connection.query(`
        SELECT *
        FROM reports
        WHERE target_id='${targetId}' AND reporter_id='${userId}'
      `);

      if (reportedOpinion.length > 0) return;

      // Add report
      const [createdResult] = await connection.query(`
        INSERT INTO reports (object, target_id, reporter_id, reason)
        VALUES (?, ?, ?, ?)
      `, [object, targetId, userId, reason]);

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