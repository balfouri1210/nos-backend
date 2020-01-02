const authService = require('../services/auth-service');
const { errors } = require('../constants/index');

module.exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.send(result);
  } catch (err) {
    switch (err.message) {
      case errors.USER_NOT_FOUND.code:
        res.status(400).send({
          code: errors.USER_NOT_FOUND.code,
          message: errors.USER_NOT_FOUND.message
        });
        break;

      case errors.INVALID_PASSWORD.code:
        res.status(400).send({
          code: errors.INVALID_PASSWORD.code,
          message: errors.INVALID_PASSWORD.message
        });
        break;

      case errors.USER_NOT_ACTIVATED.code:
        res.status(400).send({
          code: errors.USER_NOT_ACTIVATED.code,
          message: errors.USER_NOT_ACTIVATED.message
        });
        break;

      default :
        res.status(400).send({
          message: 'login failed!'
        });
    }
  }
};

module.exports.accountVerification = async (req, res) => {
  try {
    const result = await authService.accountVerification(req.body);
    res.send(result);
  } catch (err) {
    switch (err.message) {
      case errors.INVALID_VERIFICATION_CODE.code:
        res.status(400).send({
          code: errors.INVALID_VERIFICATION_CODE.code,
          message: errors.INVALID_VERIFICATION_CODE.message
        });
        break;

      case errors.ALREADY_ACTIVATED_USER.code:
        res.status(400).send({
          code: errors.ALREADY_ACTIVATED_USER.code,
          message: errors.ALREADY_ACTIVATED_USER.message
        });
        break;

      default :
        res.status(400).send({
          message: 'account verification failed!'
        });
    }
  }
};
