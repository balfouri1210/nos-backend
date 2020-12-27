const historyService = require('../../services/history/history-service');
const playerService = require('../../services/history/player-service');
const commentService = require('../../services/history/comment-service');
const replyService = require('../../services/history/reply-service');
const { errors, defaultServerResponse } = require('../../constants/index');
const createLog = require('../../config/logger');

module.exports.getLatestHistoryId = async (req, res) => {
  try {
    const result = await historyService.getLatestHistoryId(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getHistories = async (req, res) => {
  try {
    const result = await historyService.getHistories(
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
    const result = await historyService.getHistory(
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
    const result = await historyService.addHistory();
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};


module.exports.getTotalPlayerCountByHistoryId = async (req, res) => {
  try {
    const result = await playerService.getTotalPlayerCountByHistoryId(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerListByHistoryId = async (req, res) => {
  try {
    const result = await playerService.getPlayerListByHistoryId(
      req.params,
      req.query
    );
    res.send(result);
    createLog('info', 'Get Player List History', req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

// History페이지 player-modal 에서 필요
module.exports.getPlayerHistoryByHistoryId = async (req, res) => {
  try {
    const result = await playerService.getPlayerHistoryByHistoryId(
      req.params
    );
    res.send(result);
    createLog('info', 'Get Player History', req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};


module.exports.getPlayerCommentsHistoryPreviewByHistoryId = async (req, res) => {
  try {
    const result = await commentService.getPlayerCommentsHistoryPreviewByHistoryId(
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerCommentsHistoriesByPlayerId = async (req, res) => {
  try {
    const result = await commentService.getPlayerCommentsHistoriesByPlayerId(
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerReplyHistoriesByHistoryId = async (req, res) => {
  try {
    const result = await replyService.getPlayerReplyHistoriesByHistoryId(
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};