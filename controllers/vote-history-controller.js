const voteHistoryService = require('../services/vote-history-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayerCommentVoteHistories = async (req, res) => {
  try {
    const result = await voteHistoryService.getOpinionVoteHistoriesByUserId({
      targetOpinion: 'player_comment_vote_histories',
      userId: req.params.userId
    });
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
