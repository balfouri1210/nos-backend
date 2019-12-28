const authService = require('../services/auth-service');

module.exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    if (result.id) {
      res.send(result);
    } else {
      res.status(400).send({ message: result });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};
