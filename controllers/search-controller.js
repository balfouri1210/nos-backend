const searchService = require('../services/search-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.searchPlayer = async (req, res) => {
  try {
    const result = await searchService.searchPlayer(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.searchPlayerByClub = async (req, res) => {
  try {
    const result = await searchService.searchPlayerByClub(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
