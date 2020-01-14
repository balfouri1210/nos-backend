const voteHistoryService = require('../services/vote-history-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayerCommentVoteHistories = async (req, res) => {
  try {
    const result = await voteHistoryService.getVoteHistoriesByUserId(
      'player_comments_vote_histories',
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
