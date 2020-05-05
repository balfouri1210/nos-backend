const adminPlayerService = require('../../services/admin/player-service');
const { errors, defaultServerResponse } = require('../../constants/index');

module.exports.getPlayers = async (req, res) => {
  try {
    const result = await adminPlayerService.getPlayers(req.query);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.updatePlayer = async (req, res) => {
  try {
    const result = await adminPlayerService.updatePlayer(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.createPlayer = async (req, res) => {
  try {
    const result = await adminPlayerService.createPlayer(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.deletePlayer = async (req, res) => {
  try {
    const result = await adminPlayerService.deletePlayer(req.query);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
