const express = require('express');
const router = express.Router();
const voteHistoriesController = require('../controllers/vote-histories-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/player-comment/:userId',
  tokenValidation.validationToken,
  voteHistoriesController.getPlayerCommentVoteHistories
);

module.exports = router;
