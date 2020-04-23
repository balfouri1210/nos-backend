const pool = require('../../database/db-connection');
const { errors } = require('../../constants/index');
const moment = require('moment');

module.exports.getUserTotalCount = async () => {
  try {
    const [userTotalCount] = await pool.query(`
      SELECT COUNT(*) as totalCount
      FROM users
    `);

    if (!userTotalCount) 
      throw new Error(errors.USER_NOT_FOUND.message);

    return { userTotalCount: userTotalCount[0]['totalCount'] };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getUsers = async ({ searchKeyword }) => {
  try {
    let query;

    if (searchKeyword) {
      query = `
        SELECT id, email, username, gender, birth, status, created_at, activated_at, authorization
        FROM users
        WHERE email LIKE '%${searchKeyword}%'
      `;
    } else {
      query = `
        SELECT id, email, username, gender, birth, status, created_at, activated_at, authorization
        FROM users
      `;
    }

    const [users] = await pool.query(query);

    if (!users) 
      throw new Error(errors.USER_NOT_FOUND.message);

    return { users };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.updateUser = async ({ userId, username, gender, birth, status, authorization }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const [updatedUser] = await connection.query(`
        UPDATE users SET
        username='${username}',
        gender='${gender}',
        birth='${birth}',
        status='${status}',
        authorization='${authorization}',
        updated_at='${moment().utc().format('YYYY-MM-DD HH:mm:ss')}'
        WHERE id='${userId}'
      `);

      if (!updatedUser) {
        throw new Error(errors.UPDATE_USER_FAILED.message);
      }

      return updatedUser;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};