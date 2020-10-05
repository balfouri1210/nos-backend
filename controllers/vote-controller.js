const voteService = require('../services/vote-service');
const { errors, defaultServerResponse } = require('../constants/index');

// Opinion
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

module.exports.updateOpinionVote = async (req, res) => {
  try {
    const result = await voteService.updateOpinionVote(
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
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

// Player
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

module.exports.updatePlayerVote = async (req, res) => {
  try {
    const result = await voteService.updatePlayerVote(
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
      req.query
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};


// Fake
module.exports.playerVoteFake = async (req, res) => {
  try {
    const result = await voteService.playerVoteFake(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.opinionVoteFake = async (req, res) => {
  try {
    const result = await voteService.opinionVoteFake(
      req.headers.authorization,
      req.body
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
