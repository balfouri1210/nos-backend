const userService = require('../services/user-service');
const emailService = require('../services/email-service');
const { errors, defaultServerResponse } = require('../constants/index');

// TEST API
module.exports.getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params);
    res.send(result);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const result = await userService.signup(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.sendSignupEmailAgain = async (req, res) => {
  try {
    const result = await emailService.sendSignupEmailAgain(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
