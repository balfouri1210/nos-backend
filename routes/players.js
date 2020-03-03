const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player-controller');
// const tokenValidation = require('../middleware/token-validation');

router.get('/',
  playerController.getPlayers
);

router.get('/:playerId',
  playerController.getPlayerById
);

router.put('/hits/:playerId',
  playerController.increasePlayerHits
);

module.exports = router;
