const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote-controller');
const tokenValidation = require('../middleware/token-validation');

// Opinion
router.post('/opinion',
  tokenValidation.validationToken,
  voteController.opinionVote
);

router.put('/opinion',
  tokenValidation.validationToken,
  voteController.updateOpinionVote
);

router.delete('/opinion',
  tokenValidation.validationToken,
  voteController.cancelOpinionVote
);

// Player
router.post('/player',
  tokenValidation.validationToken,
  voteController.playerVote
);

router.put('/player',
  tokenValidation.validationToken,
  voteController.updatePlayerVote
);

router.delete('/player',
  tokenValidation.validationToken,
  voteController.cancelPlayerVote
);

module.exports = router;
