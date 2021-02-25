const clubService = require('../services/club-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getClubs = async (req, res) => {
  try {
    const result = await clubService.getClubs(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getClubStandings = async (req, res) => {
  try {
    const result = await clubService.getClubStandings(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
