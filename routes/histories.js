const express = require('express');
const router = express.Router();
const historiesController = require('../controllers/histories-controller');

router.get('/latest',
  historiesController.getLatestHistoryId
);

router.get('/',
  historiesController.getHistories
);

router.get('/:historyId',
  historiesController.getHistory,
);

router.post('/',
  historiesController.addHistories
);

router.put('/player/:historyId',
  historiesController.getPlayerHistories
);


// History페이지 player-modal 에서 필요
router.get('/:historyId/player/:playerId',
  historiesController.getPlayerHistory
);

router.get('/:historyId/player/:playerId/comments',
  historiesController.getPlayerCommentsHistories
);

router.get('/:historyId/player/:playerId/replies',
  historiesController.getPlayerRepliesHistories
);


module.exports = router;
