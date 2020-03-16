const reportService = require('../services/report-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.reportOpinion = async (req, res) => {
  try {
    const result = await reportService.reportOpinion(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
