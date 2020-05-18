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

module.exports.getUsers = async ({ searchKeyword, page }) => {
  try {
    const userPerPage = 20;
    page = page || 1;
    let query;

    if (searchKeyword) {
      query = `
        SELECT id, email, username, birth, status, created_at, activated_at, updated_at, authorization
        FROM users
        WHERE email LIKE '%${searchKeyword}%'
        LIMIT ${userPerPage}
        OFFSET ${userPerPage * (page - 1)}
      `;
    } else {
      query = `
        SELECT id, email, username, birth, status, created_at, activated_at, updated_at, authorization
        FROM users
        LIMIT ${userPerPage}
        OFFSET ${userPerPage * (page - 1)}
      `;
    }

    const [users] = await pool.query(query);

    const [totalUserCount] = await pool.query(`
      SELECT COUNT(*) as totalCount
      FROM users
      WHERE users.email LIKE '%${searchKeyword || ''}%'
    `);

    if (!users) 
      throw new Error(errors.USER_NOT_FOUND.message);

    return {
      users,
      currentPage: 1,
      totalPage: Math.ceil(totalUserCount[0]['totalCount'] / userPerPage)
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.updateUser = async ({ userId, username, birth, status, authorization }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const [updatedUser] = await connection.query(`
        UPDATE users SET
        username='${username}',
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