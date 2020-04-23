const adminBaseService = require('../../services/admin/base-service');
const { errors, defaultServerResponse } = require('../../constants/index');

module.exports.login = async (req, res) => {
  try {
    const result = await adminBaseService.login(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
