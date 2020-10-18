const playerService = require('../services/player-service');
const { errors, defaultServerResponse } = require('../constants/index');
const createLog = require('../config/logger');

module.exports.getTotalPlayerCount = async (req, res) => {
  try {
    const result = await playerService.getTotalPlayerCount();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getTopPlayer = async (req, res) => {
  try {
    const result = await playerService.getTopPlayer();
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayers = async (req, res) => {
  try {
    const result = await playerService.getPlayers(
      req.query
    );
    res.send(result);
    createLog('info', 'Get Players', req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getHeavyPlayerById = async (req, res) => {
  try {
    const result = await playerService.getHeavyPlayerById(
      req.headers.authorization,
      req.params
    );
    res.send(result);
    createLog('info', `Get Player Info: ${req.query.playerName}`, req);
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



