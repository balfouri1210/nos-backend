const replyService = require('../services/reply-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayerReplyByParentId = async (req, res) => {
  try {
    const result = await replyService.getPlayerReplyByParentId(req.params);
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
