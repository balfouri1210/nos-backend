const historiesService = require('../services/histories-service');
const { errors, defaultServerResponse } = require('../constants/index');
const createLog = require('../config/logger');

module.exports.getLatestHistoryId = async (req, res) => {
  try {
    const result = await historiesService.getLatestHistoryId(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getHistories = async (req, res) => {
  try {
    const result = await historiesService.getHistories(
      req.query
    );
    res.send(result);
    createLog('info', 'Get Histories', req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getHistory = async (req, res) => {
  try {
    const result = await historiesService.getHistory(
      req.params
    );
    res.send(result);
    createLog('info', `Get History: ID - ${req.params.historyId}`, req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.addHistory = async (req, res) => {
  try {
    const result = await historiesService.addHistory();
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getTotalPlayerCountByHistoryId = async (req, res) => {
  try {
    const result = await historiesService.getTotalPlayerCountByHistoryId(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerListHistory = async (req, res) => {
  try {
    const result = await historiesService.getPlayerListHistory(
      req.params,
      req.query
    );
    res.send(result);
    createLog('info', 'Get Player List History', req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerCommentsHistoryPreview = async (req, res) => {
  try {
    const result = await historiesService.getPlayerCommentsHistoryPreview(
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};


// History페이지 player-modal 에서 필요
module.exports.getPlayerHistory = async (req, res) => {
  try {
    const result = await historiesService.getPlayerHistory(
      req.params
    );
    res.send(result);
    createLog('info', 'Get Player History', req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerCommentsHistoriesBySortType = async (req, res) => {
  try {
    const result = await historiesService.getPlayerCommentsHistoriesBySortType(
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerRepliesHistories = async (req, res) => {
  try {
    const result = await historiesService.getPlayerRepliesHistories(
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};