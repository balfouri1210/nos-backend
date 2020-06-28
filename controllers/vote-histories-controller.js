const voteHistoriesService = require('../services/vote-histories-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getPlayerCommentVoteHistories = async (req, res) => {
  try {
    const result = await voteHistoriesService.getOpinionVoteHistoriesByUserId({
      targetOpinion: 'player_comment_vote_histories',
      userId: req.params.userId
    });
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
