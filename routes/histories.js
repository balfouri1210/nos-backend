const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history/history-controller');

router.get('/latest',
  historyController.getLatestHistoryId
);

router.get('/',
  historyController.getHistories
);

router.get('/:historyId',
  historyController.getHistory,
);

router.post('/',
  historyController.addHistory
);

router.get('/:historyId/player/total',
  historyController.getTotalPlayerCountByHistoryId
);

router.get('/:historyId/player',
  historyController.getPlayerListByHistoryId
);

router.get('/:historyId/player/comments/preview',
  historyController.getPlayerCommentsHistoryPreviewByHistoryId
);


// History페이지 player-modal 에서 필요
router.get('/:historyId/player/:playerId',
  historyController.getPlayerHistoryByHistoryId
);

router.get('/:historyId/player/:playerId/comments',
  historyController.getPlayerCommentsHistoriesByPlayerId
);

router.get('/:historyId/player/:playerId/replies',
  historyController.getPlayerReplyHistoriesByHistoryId
);


module.exports = router;
