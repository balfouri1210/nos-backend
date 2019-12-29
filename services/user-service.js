const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const bcrypt = require('bcryptjs');

module.exports.getUser = async (reqData) => {
  try {
    const [rows] = await pool.query('select * from users');
    return rows;
  } catch (err) {
    err.message = 'select users failed';
    throw new Error(err);
  }
};

module.exports.signup = async ({ email, password, username, countryId, birth, gender }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [existingUser] = await connection.query(`SELECT * FROM users WHERE email='${email}'`);
      if (existingUser[0]) {
        throw new Error({
          code: errors.EMAIL_ALREADY_EXISTS.code,
          message: errors.EMAIL_ALREADY_EXISTS.message
        });
      }

      password = await bcrypt.hash(password, 12);
      console.log(password);
      const insertSql = 'INSERT INTO users (email, password, username, country_id, birth, gender) VALUES (?, ?, ?, ?, ?, ?)';
      const params = [email, password, username, countryId, birth, gender];

      const [signedUpUser] = await connection.query(insertSql, params);
      return {
        id: signedUpUser.insertId,
        email: email
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err);
  }
};
