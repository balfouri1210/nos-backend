const authService = require('../services/auth-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.accountVerification = async (req, res) => {
  try {
    const result = await authService.accountVerification(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.accountActivation = async (req, res) => {
  try {
    const result = await authService.accountActivation(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.availableEmailChecker = async (req, res) => {
  try {
    const result = await authService.availableEmailChecker(req.params);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.availableUsernameChecker = async (req, res) => {
  try {
    const result = await authService.availableUsernameChecker(req.params);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.passwordReset = async (req, res) => {
  try {
    const result = await authService.passwordReset(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
