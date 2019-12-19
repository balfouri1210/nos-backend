const pool = require('../database/db-connection');

module.exports.getUser = async (serviceData) => {
  const [rows] = await pool.query('select * from user');
  return rows;
};
