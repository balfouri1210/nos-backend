const searchService = require('../services/search-service');
const { errors, defaultServerResponse } = require('../constants/index');
const createLog = require('../config/logger');

module.exports.searchPlayer = async (req, res) => {
  try {
    const result = await searchService.searchPlayer(
      req.query
    );
    res.send(result);

    const { keyword, clubId, countryId } = req.query;
    if (keyword) {
      createLog('info', `Search Player - by keyword: ${keyword}`, req);
    } else if (clubId) {
      createLog('info', `Search Player - by clubId: ${clubId}`, req);
    } else if (countryId) {
      createLog('info', `Search Player - by countryId: ${countryId}`, req);
    }
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
