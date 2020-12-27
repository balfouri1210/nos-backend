const express = require('express');
const router = express.Router();
const voteHistoryController = require('../controllers/vote-history-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/player-comment/:userId',
  tokenValidation.validationToken,
  voteHistoryController.getPlayerCommentVoteHistories
);

module.exports = router;
