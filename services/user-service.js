const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendSignupEmail } = require('./email-service');

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

      // Encrypt password
      password = await bcrypt.hash(password, 12);

      // Make verification code
      const keyOne = crypto.randomBytes(256).toString('hex').substr(100, 10);
      const keyTwo = crypto.randomBytes(256).toString('base64').substr(50, 10);
      const verificationCode = keyOne + keyTwo;

      // Query
      const insertSql = 'INSERT INTO users (email, password, username, country_id, birth, gender, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const params = [email, password, username, countryId, birth, gender, verificationCode];
      const [signedUpUser] = await connection.query(insertSql, params);

      // Send signup email - this function is async but executed without 'await'
      sendSignupEmail(email, verificationCode);

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
