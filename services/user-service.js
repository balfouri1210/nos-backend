const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const bcrypt = require('bcryptjs');
const { sendSignupEmail, sendVerificationEmail } = require('./email-service');
const { extractUserInfoFromJWT, generateNewVerificationCode, generateNewJWT } = require('./auth-service');
const moment = require('moment');

// TEST API
module.exports.getUserById = async ({ id }) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id='${id}'`);
    const user = rows[0];

    if (!user)
      throw new Error(errors.USER_NOT_FOUND.message);

    return user;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.signup = async ({ email, password, username, countryId, birth, gender }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [existingUser] = await connection.query(`SELECT * FROM users WHERE email='${email}'`);
      if (existingUser[0]) throw new Error(errors.UNAVAILABLE_EMAIL.message);

      // Encrypt password
      password = await bcrypt.hash(password, 12);
      const verificationCode = generateNewVerificationCode();

      // Query
      const insertSql = 'INSERT INTO users (email, password, username, country_id, birth, gender, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const params = [email, password, username, countryId, birth, gender, verificationCode];
      const [signedUpUser] = await connection.query(insertSql, params);
      if (signedUpUser[0]) throw new Error(errors.SIGNUP_FAILED.message);

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
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.updateUserProfile = async (authorization, { username, countryId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const { userId } = extractUserInfoFromJWT(authorization);
      const targetUser = await this.getUserById({ id: userId });
      const date = new Date();
      
      // 마지막 수정일 기준 30일이 지나지 않으면 업데이트 할 수 없음.
      if ((moment(date).valueOf() - moment(targetUser.updated_at).valueOf()) < 1000 * 60 * 60 * 24 * 30) {
        throw new Error(errors.LESS_THAN_THIRTY_DAYS.message);
      } else {
        const [updateResult] = await connection.query(`
          UPDATE users SET username='${username}', country_id='${countryId}',
          updated_at='${moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')}'
          WHERE id='${userId}'
        `);

        if (!updateResult)
          throw new Error(errors.UPDATE_USER_FAILED.message);

        // Generate new token to apply updated username, country
        const token = generateNewJWT({ ...targetUser, username: username });
        return { newToken: token };
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.updateUserPassword = async (authorization, { oldPassword, newPassword }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const { userId } = extractUserInfoFromJWT(authorization);
      const targetUser = await this.getUserById({ id: userId });

      const isValid = await bcrypt.compare(oldPassword, targetUser.password);
      if (isValid) {
        newPassword = await bcrypt.hash(newPassword, 12);

        const [updateResult] = await connection.query(`
          UPDATE users SET password='${newPassword}'
          WHERE id='${userId}'
        `);
  
        if (!updateResult)
          throw new Error(errors.UPDATE_USER_FAILED.message);
      } else {
        throw new Error(errors.INVALID_PASSWORD.message);
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

module.exports.deleteUser = async (authorization, { currentPassword }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const { userId } = extractUserInfoFromJWT(authorization);
      const targetUser = await this.getUserById({ id: userId });

      const isValid = await bcrypt.compare(currentPassword, targetUser.password);
      if (isValid) {
        const [deletedUser] = await pool.query(`
          DELETE FROM users
          WHERE id='${userId}'
        `);
        if (!deletedUser)
          throw new Error(errors.DELETE_USER_FAILED.message);

        await pool.query(`DELETE FROM player_comments WHERE users_id='${userId}'`);
        await pool.query(`DELETE FROM player_replies WHERE users_id='${userId}'`);
        await pool.query(`DELETE FROM player_comments_vote_histories WHERE users_id='${userId}'`);
        await pool.query(`DELETE FROM player_replies_vote_histories WHERE users_id='${userId}'`);

        return;
      } else {
        throw new Error(errors.INVALID_PASSWORD.message);
      }
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};


// 구현했지만 쓰이지 않는 것들
// Generate or Delete volatile verification code.
// Decision by 'action' parameter.
module.exports.updateVolatileVerificationCode = async (authorization, { action }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const decodedUser = extractUserInfoFromJWT(authorization);
    
      const userId = decodedUser.userId;
      const volatileVerificationCode =
        action === 'generate' ? Math.floor(100000 + Math.random() * 900000) : 'NULL';

      const [updateResult] = await pool.query(`
        UPDATE users SET volatile_verification_code='${volatileVerificationCode}'
        WHERE id='${userId}'
      `);
      if (!updateResult)
        throw new Error(errors.GENERATE_VOLATILE_VER_CODE_FAILED.message);

      // Don't wait sending verify email
      if (action === 'generate') {
        const email = decodedUser.email;
        sendVerificationEmail(email, volatileVerificationCode);
      }

      return {
        volatileVerificationCode
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.deleteVolatileVerificationCode = async (authorization) => {
  try {
    const connection = await pool.getConnection();

    try {
      const decodedUser = extractUserInfoFromJWT(authorization);
    
      const userId = decodedUser.userId;

      const [updateResult] = await pool.query(`
        UPDATE users SET volatile_verification_code='NULL' 
        WHERE id='${userId}'
      `);
      if (!updateResult)
        throw new Error(errors.DELETE_VOLATILE_VER_CODE_FAILED.message);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
