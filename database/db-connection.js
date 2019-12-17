const mysql = require('mysql');

const db = module.exports = mysql.createConnection({
  host: process.env[`DB_URL_${process.env.STAGE}`],
  user: 'admin',
  password: 'kjh236874',
  database: 'nos'
});

db.connect();
