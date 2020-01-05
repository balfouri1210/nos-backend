const authService = require('../services/auth-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.send(result);
  } catch (err) {
    const error = errors[err.message] || defaultServerResponse;
    res.status(400).send(error);
  }
};

module.exports.accountVerification = async (req, res) => {
  try {
    const result = await authService.accountVerification(req.body);
    res.send(result);
  } catch (err) {
    const error = errors[err.message] || defaultServerResponse;
    res.status(400).send(error);
  }
};
