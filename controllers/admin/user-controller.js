const adminUserService = require('../../services/admin/user-service');
const { errors, defaultServerResponse } = require('../../constants/index');

module.exports.getUserTotalCount = async (req, res) => {
  try {
    const result = await adminUserService.getUserTotalCount();
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const result = await adminUserService.getUsers(req.query);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const result = await adminUserService.updateUser(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
