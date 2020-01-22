const mysql = require('mysql2/promise');

// https://github.com/mysqljs/mysql#connection-options 참고하세요
const pool = mysql.createPool({
  host: process.env[`DB_URL_${process.env.STAGE}`],
  port: 3306,
  user: 'admin',
  password: 'kjh236874',
  database: 'nos',
  timezone: '+00:00'
});

module.exports = pool;
