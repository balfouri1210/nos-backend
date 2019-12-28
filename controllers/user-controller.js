const userService = require('../services/user-service');

module.exports.getUser = async (req, res) => {
  try {
    const result = await userService.getUser(req.body);
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
    res.status(400).send({ message: err.message });
  }
};
