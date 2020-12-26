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
  historiesController.getPlayerListHistory
);

router.get('/:historyId/player/comments/preview',
  historiesController.getPlayerCommentsHistoryPreview
);


// History페이지 player-modal 에서 필요
router.get('/:historyId/player/:playerId',
  historiesController.getPlayerHistory
);

router.get('/:historyId/player/:playerId/comments',
  historiesController.getPlayerCommentsHistoriesBySortType
);

router.get('/:historyId/player/:playerId/replies',
  historiesController.getPlayerRepliesHistories
);


module.exports = router;
