const userService = require('../services/user-service');
const emailService = require('../services/email-service');
const { errors, defaultServerResponse } = require('../constants/index');

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
    const error = errors[err.message] || defaultServerResponse;
    res.status(400).send(error);
  }
};

module.exports.sendSignupEmailAgain = async (req, res) => {
  try {
    const result = await emailService.sendSignupEmailAgain(req.body.email);
    res.send(result);
  } catch (err) {
    const error = errors[err.message.split(' ')[1]] || defaultServerResponse;
    res.status(400).send(error);
  }
};
