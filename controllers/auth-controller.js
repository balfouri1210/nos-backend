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
