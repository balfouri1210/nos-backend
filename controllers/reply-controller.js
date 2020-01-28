const replyService = require('../services/reply-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayerReplyByParentCommentsId = async (req, res) => {
  try {
    const result = await replyService.getPlayerReplyByParentCommentsId(
      req.headers.authorization,
      req.params,
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.addPlayerReply = async (req, res) => {
  try {
    const result = await replyService.addPlayerReply(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.editPlayerReply = async (req, res) => {
  try {
    const result = await replyService.editPlayerReply(req.params, req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.deletePlayerReply = async (req, res) => {
  try {
    const result = await replyService.deletePlayerReply(req.params, req.query);
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
