const metaService = require('../services/meta-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getMetadataFromUrl = async (req, res) => {
  try {
    const result = await metaService.getMetadataFromUrl(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
