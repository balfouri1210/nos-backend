const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player-controller');
// const tokenValidation = require('../middleware/token-validation');

router.get('/',
  playerController.getPlayers
);

module.exports = router;
