const userService = require('../services/user-service');
const { defaultServerResponse } = require('../constants/index');

module.exports.getUser = async (req, res) => {
  try {
    const result = await userService.getUser(req.body);
    res.send(result);
  } catch (err) {
    defaultServerResponse.message = err.message;
    res.send(defaultServerResponse);
  }
};
