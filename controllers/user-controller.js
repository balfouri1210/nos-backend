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

module.exports.sendPwdResetEmail = async (req, res) => {
  try {
    const result = await emailService.sendPwdResetEmail(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const result = await userService.updateUserProfile(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.updateUserPassword = async (req, res) => {
  try {
    const result = await userService.updateUserPassword(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};


module.exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(
      req.headers.authorization,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};


// 구현했지만 쓰이지 않는 것들
// generate or delete volatile verification code
module.exports.updateVolatileVerificationCode = async (req, res) => {
  try {
    const result = await userService.updateVolatileVerificationCode(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
