const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendSignupEmail } = require('./email-service');

// TEST API
module.exports.getUserById = async ({ id }) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id='${id}'`);
    const user = rows[0];
    return user;
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
        throw new Error(errors.EMAIL_ALREADY_EXISTS.message);
      }

      // Encrypt password
      password = await bcrypt.hash(password, 12);

      // Make verification code
      const keyOne = crypto.randomBytes(256).toString('hex').substr(50, 10);
      const keyTwo = crypto.randomBytes(256).toString('base64').replace(/\//g, '').substr(50, 10);
      const verificationCode = keyOne + keyTwo;

      // Query
      const insertSql = 'INSERT INTO users (email, password, username, country_id, birth, gender, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const params = [email, password, username, countryId, birth, gender, verificationCode];
      const [signedUpUser] = await connection.query(insertSql, params);

      // Send signup email - this function is async but executed without 'await'
      // api gateway + lambda process
      sendSignupEmail(email, verificationCode);

      return {
        id: signedUpUser.insertId,
        email: email
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};
