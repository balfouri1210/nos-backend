const childCommentService = require('../services/child-comment-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayerChildCommentByParentId = async (req, res) => {
  try {
    const result = await childCommentService.getPlayerChildCommentByParentId(req.params);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.addPlayerChildComment = async (req, res) => {
  try {
    const result = await childCommentService.addPlayerChildComment(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
