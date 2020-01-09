const express = require('express');
const router = express.Router();
const childCommentController = require('../controllers/child-comment-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/player/:parentId',
  childCommentController.getPlayerChildCommentByParentId
);

router.post('/player',
  tokenValidation.validationToken,
  childCommentController.addPlayerChildComment
);

module.exports = router;
