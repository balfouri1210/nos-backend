// const pool = require('../database/db-connection');
const mysql = require('mysql');

// module.exports.getUser = async (serviceData) => {
//   try {
//     const [rows] = await pool.query('select * from user');
//     return rows;
//   } catch (err) {
//     err.message = 'Query failed!';
//     return err;
//   }
// };

module.exports.getUser = (serviceData, callback) => {
  // const [rows] = await pool.query('select * from user');
  const connection = mysql.createConnection({
    host: process.env[`DB_URL_${process.env.STAGE}`],
    port: 3306,
    user: 'admin',
    password: 'kjh236874',
    database: 'nos'
  });

  connection.query('SELECT * FROM user', function (err, rows, fields) {
    if (!err) {
      callback(rows);
    } else {
      err.message = 'Query Failed!!!!';
      throw err;
    }
  });
};
