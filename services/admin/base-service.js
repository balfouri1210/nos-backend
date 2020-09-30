const pool = require('../../database/db-connection');
const { errors } = require('../../constants/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.login = async ({ email, password }) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM users
      WHERE email='${email}' AND authorization=3
    `);
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