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

module.exports.addHistories = async (req, res) => {
  try {
    const result = await historiesService.addHistories();
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getTotalPlayersOfHistory = async (req, res) => {
  try {
    const result = await historiesService.getTotalPlayersOfHistory(
      req.params
    );
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
    createLog('info', 'Get Playerlist History', req);
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

module.exports.getPlayerCommentsHistories = async (req, res) => {
  try {
    const result = await historiesService.getPlayerCommentsHistories(
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