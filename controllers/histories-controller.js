const historiesService = require('../services/histories-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getHistory = async (req, res) => {
  try {
    const result = await historiesService.getHistory(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getHistories = async (req, res) => {
  try {
    const result = await historiesService.getHistories();
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.addHistories = async (req, res) => {
  try {
    const result = await historiesService.addHistories();
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerHistories = async (req, res) => {
  try {
    const result = await historiesService.getPlayerHistories(
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
