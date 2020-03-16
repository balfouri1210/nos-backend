const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote-controller');
const tokenValidation = require('../middleware/token-validation');

router.put('/opinion',
  tokenValidation.validationToken,
  voteController.opinionVote
);

router.put('/player',
  tokenValidation.validationToken,
  voteController.playerVote
);

module.exports = router;
