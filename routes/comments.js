const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/count',
  commentController.getTotalCommentsCount
);

router.get('/count/player/:playerId',
  commentController.getPlayerCommentsCountByPlayerId
);

router.get('/player/:playerId',
  commentController.getPlayerCommentsByPlayerId
);

router.get('/preview/player',
  commentController.getPlayerCommentsPreview
);

router.get('/player',
  commentController.getWholePlayerComments
);

router.post('/player',
  tokenValidation.validationToken,
  commentController.addPlayerComment
);

router.post('/player/fake',
  tokenValidation.validationToken,
  commentController.addFakePlayerComment
);

router.put('/player/:commentId',
  tokenValidation.validationToken,
  commentController.editPlayerComment
);

router.delete('/player/:playerId/:commentId',
  tokenValidation.validationToken,
  commentController.deletePlayerComment
);

module.exports = router;
