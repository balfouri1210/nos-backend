const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote-controller');
const tokenValidation = require('../middleware/token-validation');
const originValidation = require('../middleware/origin-validation');

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
  originValidation.validateOrigin,
  voteController.playerVote
);

router.put('/player',
  tokenValidation.validationToken,
  originValidation.validateOrigin,
  voteController.updatePlayerVote
);

router.delete('/player',
  tokenValidation.validationToken,
  originValidation.validateOrigin,
  voteController.cancelPlayerVote
);


// Fake
router.post('/player/fake',
  tokenValidation.validationToken,
  originValidation.validateOrigin,
  voteController.playerVoteFake
);

module.exports = router;
