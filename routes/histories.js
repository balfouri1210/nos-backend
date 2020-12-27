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
  historiesController.addHistory
);

router.get('/:historyId/player/total',
  historiesController.getTotalPlayerCountByHistoryId
);

router.get('/:historyId/player',
  historiesController.getPlayerListByHistoryId
);

router.get('/:historyId/player/comments/preview',
  historiesController.getPlayerCommentsHistoryPreviewByHistoryId
);


// History페이지 player-modal 에서 필요
router.get('/:historyId/player/:playerId',
  historiesController.getPlayerHistoryByHistoryId
);

router.get('/:historyId/player/:playerId/comments',
  historiesController.getPlayerCommentsHistoriesBySortType
);

router.get('/:historyId/player/:playerId/replies',
  historiesController.getPlayerReplyHistoriesByHistoryId
);


module.exports = router;
