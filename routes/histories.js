const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history/history-controller');

// HISTORY
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


// COMMENT
router.get('/:historyId/player/comments/count',
  historyController.getTotalCommentsHistoryCount
);

router.get('/:historyId/player/comments',
  historyController.getWholePlayerCommentsHistoryByHistoryId
);

router.get('/:historyId/player/comments/preview',
  historyController.getPlayerCommentsHistoryPreviewByHistoryId
);

router.get('/:historyId/player/:playerId/comments',
  historyController.getPlayerCommentsHistoriesByPlayerId
);


// PLAYER
router.get('/:historyId/player/:playerId',
  historyController.getPlayerHistoryByHistoryId
);


// REPLY
router.get('/:historyId/player/:playerId/replies',
  historyController.getPlayerReplyHistoriesByHistoryId
);


module.exports = router;
