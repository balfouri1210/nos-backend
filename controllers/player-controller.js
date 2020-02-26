const playerService = require('../services/player-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayers = async (req, res) => {
  try {
    const result = await playerService.getPlayers(
      req.headers.authorization,
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
