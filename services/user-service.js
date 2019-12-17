const db = require('../database/db-connection');

module.exports.createUser = (serviceData) => {
  db.query('select * from user', function (err, result, fields) {
    if (err) throw err;
    return result;
  });
};
