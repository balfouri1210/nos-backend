const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const bcrypt = require('bcryptjs');
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

    return { token };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.accountVerification = async ({ verificationCode }) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE verification_code='${verificationCode}'`);
    const user = rows[0];

    if (!user) {
      throw new Error(errors.INVALID_VERIFICATION_CODE.message);
    } else if (user.status === 'activated') {
      throw new Error(errors.ALREADY_ACTIVATED_USER.message);
    }

    const result = await pool.query(`UPDATE users SET status='activated', activated_at='${moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')}' WHERE id='${user.id}'`);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.extractUserIdFromJWT = (authorization) => {
  const token = authorization.split('Bearer')[1].trim();
  if (token !== 'null') {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'nos-secret-key');
    return decoded.id;
  }
  return null;
};