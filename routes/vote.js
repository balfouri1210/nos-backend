const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote-controller');
const tokenValidation = require('../middleware/token-validation');

router.put('/opinion',
  tokenValidation.validationToken,
  voteController.opinionVote
);

router.put('/opinion/cancel',
  tokenValidation.validationToken,
  voteController.cancelOpinionVote
);

router.put('/player',
  tokenValidation.validationToken,
  voteController.playerVote
);

router.put('/player/cancel',
  tokenValidation.validationToken,
  voteController.cancelPlayerVote
);


module.exports = router;
