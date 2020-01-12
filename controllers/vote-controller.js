const voteService = require('../services/vote-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.vote = async (req, res) => {
  try {
    const result = await voteService.vote(
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.cancelVote = async (req, res) => {
  try {
    const result = await voteService.cancelVote(
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
