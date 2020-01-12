const commentService = require('../services/comment-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayerCommentsByPlayerId = async (req, res) => {
  try {
    const result = await commentService.getPlayerCommentsByPlayerId(req.params);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.addPlayerComment = async (req, res) => {
  try {
    const result = await commentService.addPlayerComment(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
