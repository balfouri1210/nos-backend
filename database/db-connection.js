const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env[`DB_URL_${process.env.STAGE}`],
  port: 3306,
  user: 'admin',
  password: 'kjh236874',
  database: 'nos'
});

module.exports = pool;
