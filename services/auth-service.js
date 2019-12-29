const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = async ({ email, password }) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
    const user = rows[0];

    if (!user) {
      throw new Error(errors.USER_NOT_FOUND.code);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error(errors.INVALID_PASSWORD.code);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.SECRET_KEY || 'nos-secret-key',
      { expiresIn: '3d' }
    );

    return { token };
  } catch (err) {
    throw new Error(err.message);
  }
};
