const authService = require('../services/auth-service');
const { errors } = require('../constants/index');

module.exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.send(result);
  } catch (err) {
    switch (err.message) {
      case 'u002':
        res.status(400).send({
          code: err.message,
          message: errors.USER_NOT_FOUND.message
        });
        break;

      case 'u003':
        res.status(400).send({
          code: err.message,
          message: errors.INVALID_PASSWORD.message
        });
        break;

      default :
        res.status(400).send({
          message: 'login failed!'
        });
    }
  }
};
