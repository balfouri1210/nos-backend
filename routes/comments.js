const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/player/:playerId',
  commentController.getPlayerCommentsByPlayerId
);

router.post('/player',
  tokenValidation.validationToken,
  commentController.addPlayerComment
);

module.exports = router;
