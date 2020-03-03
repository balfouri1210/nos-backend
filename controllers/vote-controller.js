const voteService = require('../services/vote-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.opinionVote = async (req, res) => {
  try {
    const result = await voteService.opinionVote(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.cancelOpinionVote = async (req, res) => {
  try {
    const result = await voteService.cancelOpinionVote(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.playerVote = async (req, res) => {
  try {
    const result = await voteService.playerVote(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.cancelPlayerVote = async (req, res) => {
  try {
    const result = await voteService.cancelPlayerVote(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};