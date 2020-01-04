const constants = require('../constants');
const jwt = require('jsonwebtoken');

module.exports.validationToken = (req, res, next) => {
  const response = { ...constants.defaultServerResponse };

  try {
    if (!req.headers.authorization) {
      throw new Error(constants.errors.TOKEN_MISSING.message);
    }

    const token = req.headers.authorization.split('Bearer')[1].trim();
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'nos-secret-key');

    if (decoded) return next();
  } catch (err) {
    response.status = 401;
    response.code = constants.errors.TOKEN_MISSING.code;
    response.message = err.message;
  }

  return res.status(response.status).send(response);
};
