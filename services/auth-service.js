const pool = require('../database/db-connection');
const constants = require('../constants/index');

module.exports.login = async (reqData) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email='${reqData.email}'`);
    if (!rows.length) {
      return constants.errorMessage.USER_NOT_FOUND;
    } else {
      return rows[0];
    }
  } catch (err) {
    err.message = 'login failed';
    throw new Error(err);
  }
};
