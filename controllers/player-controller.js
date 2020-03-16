const playerService = require('../services/player-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayers = async (req, res) => {
  try {
    const result = await playerService.getPlayers(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getHeavyPlayerById = async (req, res) => {
  try {
    const result = await playerService.getHeavyPlayerById(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.increasePlayerHits = async (req, res) => {
  try {
    const result = await playerService.increasePlayerHits(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};



