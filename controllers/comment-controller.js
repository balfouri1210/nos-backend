const commentService = require('../services/comment-service');
const { errors, defaultServerResponse } = require('../constants/index');
const createLog = require('../config/logger');

module.exports.getTotalCommentsCount = async (req, res) => {
  try {
    const result = await commentService.getTotalCommentsCount(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerCommentsCountByPlayerId = async (req, res) => {
  try {
    const result = await commentService.getPlayerCommentsCountByPlayerId(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerCommentsByPlayerId = async (req, res) => {
  try {
    const result = await commentService.getPlayerCommentsByPlayerId(
      req.headers.authorization,
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerCommentsPreview = async (req, res) => {
  try {
    const result = await commentService.getPlayerCommentsPreview(
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.addPlayerComment = async (req, res) => {
  try {
    const result = await commentService.addPlayerComment(
      req.headers.authorization,
      req.body
    );
    res.send(result);

    createLog('info', `Add Comment: ${req.body.content}`, req);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.editPlayerComment = async (req, res) => {
  try {
    const result = await commentService.editPlayerComment(req.params, req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.deletePlayerComment = async (req, res) => {
  try {
    const result = await commentService.deletePlayerComment(req.params);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getPlayerCommentsBySortType = async (req, res) => {
  try {
    const result = await commentService.getPlayerCommentsBySortType(req.query);
    res.send(result);

    if (req.query.sortType === 'date') {
      createLog('info', 'Enter Comment Page', req);
    }
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};


// FAKE COMMENT !!
module.exports.addFakePlayerComment = async (req, res) => {
  try {
    const result = await commentService.addFakePlayerComment(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
// FAKE COMMENT END