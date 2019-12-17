const mysql = require('mysql');

module.exports = () => {
  try {
    return mysql.createConnection({
      host: process.env[`DB_URL_${process.env.STAGE}`],
      user: 'admin',
      password: 'kjh236874',
      database: 'nos'
    });
  } catch (err) {
    throw new Error(err);
  }
};
