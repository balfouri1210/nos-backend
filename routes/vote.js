const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote-controller');
const tokenValidation = require('../middleware/token-validation');

router.put('/',
  tokenValidation.validationToken,
  voteController.vote
);

router.put('/cancel',
  tokenValidation.validationToken,
  voteController.cancelVote
);

module.exports = router;
