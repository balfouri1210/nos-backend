const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote-controller');
const tokenValidation = require('../middleware/token-validation');
const originValidation = require('../middleware/origin-validation');

// Opinion
router.post('/opinion',
  tokenValidation.validationToken,
  originValidation.validateOrigin,
  voteController.opinionVote
);

router.put('/opinion',
  tokenValidation.validationToken,
  originValidation.validateOrigin,
  voteController.updateOpinionVote
);

router.delete('/opinion',
  tokenValidation.validationToken,
  originValidation.validateOrigin,
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

// Fake
router.post('/opinion/fake',
  tokenValidation.validationToken,
  originValidation.validateOrigin,
  voteController.opinionVoteFake
);

module.exports = router;
