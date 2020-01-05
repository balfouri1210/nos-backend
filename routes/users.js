const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const tokenValidation = require('../middleware/token-validation');

router.get('/:id',
  tokenValidation.validationToken,
  userController.getUserById
);

router.post('/', userController.signup);

router.post('/signup-email', userController.sendSignupEmailAgain);

module.exports = router;
