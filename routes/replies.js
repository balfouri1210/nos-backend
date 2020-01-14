const express = require('express');
const router = express.Router();
const replyController = require('../controllers/reply-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/player/:userId/:parentId',
  replyController.getPlayerReplyByParentId
);

router.post('/player',
  tokenValidation.validationToken,
  replyController.addPlayerReply
);

module.exports = router;
