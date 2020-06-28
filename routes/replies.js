const express = require('express');
const router = express.Router();
const replyController = require('../controllers/reply-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/player/:parentCommentId',
  replyController.getPlayerReplyByparentCommentId
);

router.post('/player',
  tokenValidation.validationToken,
  replyController.addPlayerReply
);

router.put('/player/:replyId',
  tokenValidation.validationToken,
  replyController.editPlayerReply
);

router.delete('/player/:replyId',
  tokenValidation.validationToken,
  replyController.deletePlayerReply
);

module.exports = router;
