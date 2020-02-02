const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports.login = async ({ email, password }) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
    const user = rows[0];

    if (!user) {
      throw new Error(errors.USER_NOT_FOUND.message);
    } else if (user.status !== 'activated') {
      throw new Error(errors.USER_NOT_ACTIVATED.message);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error(errors.INVALID_PASSWORD.message);
    }

    const token = this.generateNewJWT(user);

    return { token };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.accountVerification = async ({ verificationCode }) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM users WHERE verification_code='${verificationCode}'
    `);
    const user = rows[0];

    if (user) {
      return user;
    } else {
      throw new Error(errors.USER_NOT_FOUND.message);
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};


module.exports.accountActivation = async ({ verificationCode }) => {
  try {
    const user = await this.accountVerification({ verificationCode });

    if (user.status === 'activated') {
      throw new Error(errors.ALREADY_ACTIVATED_USER.message);
    }

    const [updateResult] = await pool.query(`
      UPDATE users SET
      status='activated',
      activated_at='${moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')}'
      WHERE id='${user.id}'
    `);

    if (!updateResult)
      throw new Error(errors.UPDATE_USER_FAILED.message);

    return true;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.extractUserInfoFromJWT = (authorization) => {
  try {
    const token = authorization.split('Bearer')[1].trim();
    let decoded = {};
    if (token !== 'null')
      decoded = jwt.verify(token, process.env.SECRET_KEY || 'nos-secret-key');
  
    return {
      userId: decoded.id || null,
      email: decoded.email || null,
      username: decoded.username || null
    };
  } catch (err) {
    throw new Error(errors.INVALID_TOKEN.message);
  }
};

module.exports.availableEmailChecker = async ({ email }) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM users WHERE email='${email}'
    `);
    const user = rows[0];

    if (!user) {
      return true;
    } else {
      throw new Error(errors.UNAVAILABLE_EMAIL.message);
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.availableUsernameChecker = async ({ username }) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM users WHERE username='${username}'
    `);
    const user = rows[0];

    if (!user) {
      return true;
    } else {
      throw new Error(errors.UNAVAILABLE_USERNAME.message);
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

module.exports.passwordReset = async ({ verificationCode, newPassword }) => {
  try {
    const connection = await pool.getConnection();
    newPassword = await bcrypt.hash(newPassword, 12);

    try {
      const [updateResult] = await pool.query(`
        UPDATE users SET password='${newPassword}'
        WHERE verification_code='${verificationCode}'
      `);

      if (!updateResult)
        throw new Error(errors.UPDATE_USER_FAILED.message);

      return true;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.generateNewVerificationCode = () => {
  // Make verification code
  const keyOne = crypto.randomBytes(256).toString('hex').substr(50, 10);
  const keyTwo = crypto.randomBytes(256).toString('base64').replace(/\//g, '').substr(50, 10);
  const newVerificationCode = keyOne + keyTwo;

  return newVerificationCode;
};

module.exports.generateNewJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    // JWT 생성할 때 쓰이는 SECRET_KEY도 암호화되어야 할 것 같은데? (20200102)
    process.env.SECRET_KEY || 'nos-secret-key',
    { expiresIn: '3d' }
  );

  return token;
};