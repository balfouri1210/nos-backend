const pool = require('../database/db-connection');

module.exports.getUser = async (serviceData) => {
  try {
    const [rows] = await pool.query('select * from user');
    return rows;
  } catch (err) {
    err.message = 'Query failed!';
    return err;
  }
};
