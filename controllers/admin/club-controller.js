const adminClubService = require('../../services/admin/club-service');
const { errors, defaultServerResponse } = require('../../constants/index');

module.exports.getClubs = async (req, res) => {
  try {
    const result = await adminClubService.getClubs(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.toggleClubActivation = async (req, res) => {
  try {
    const result = await adminClubService.toggleClubActivation(
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
