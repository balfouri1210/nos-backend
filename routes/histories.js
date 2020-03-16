const express = require('express');
const router = express.Router();
const historiesController = require('../controllers/histories-controller');
// const tokenValidation = require('../middleware/token-validation');

router.get('/:historyId',
  historiesController.getHistory,
);

router.get('/',
  historiesController.getHistories
);

router.post('/',
  historiesController.addHistories
);

router.get('/player/:historyId',
  historiesController.getPlayerHistories
);
module.exports = router;
