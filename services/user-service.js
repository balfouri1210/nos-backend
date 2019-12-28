const pool = require('../database/db-connection');
const constants = require('../constants/index');

module.exports.getUser = async (reqData) => {
  try {
    const [rows] = await pool.query('select * from users');
    return rows;
  } catch (err) {
    err.message = 'select users failed';
    throw new Error(err);
  }
};

module.exports.signup = async (reqData) => {
  try {
    const connection = await pool.getConnection();
    const insertSql = 'INSERT INTO users (email, password, username, country_id, birth, gender) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [reqData.email, reqData.password, reqData.username, reqData.countryId, reqData.birth, reqData.gender];

    try {
      const [row] = await connection.query(`SELECT * FROM users WHERE email='${reqData.email}'`);
      if (row.length) {
        throw new Error(constants.errorMessage.EMAIL_ALREADY_EXISTS);
      } else {
        const result = await connection.query(insertSql, params);
        return result;
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err);
  }
};
