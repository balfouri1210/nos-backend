const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player-controller');
// const tokenValidation = require('../middleware/token-validation');

router.get('/total',
  playerController.getTotalPlayerCount
);

// 원래 get으로 했지만 parameter로 배열을 받아야 해서
// put으로 변경함. 메소드만 바뀌고 하는일은 완전 동일
router.put('/',
  playerController.getPlayers
);

router.get('/:playerId',
  playerController.getHeavyPlayerById
);

router.put('/hits/:playerId',
  playerController.increasePlayerHits
);

module.exports = router;
