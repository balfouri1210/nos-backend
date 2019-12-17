const userService = require('../services/user-service');

module.exports.createUser = (req, res) => {
  const responseFromService = userService.createUser();
  res.send(responseFromService);
};
