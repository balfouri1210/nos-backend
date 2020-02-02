const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const tokenValidation = require('../middleware/token-validation');

// TEST
router.get('/:id',
  tokenValidation.validationToken,
  userController.getUserById
);

// signup
router.post('/', userController.signup);

// resend signup email
router.post('/email/signup', userController.sendSignupEmailAgain);

// send password reset email
router.post('/email/password-reset', userController.sendPwdResetEmail);

// profile update
router.put('/profile',
  tokenValidation.validationToken,
  userController.updateUserProfile
);

// password update
router.put('/password',
  tokenValidation.validationToken,
  userController.updateUserPassword
);

// delete account
router.delete('/',
  tokenValidation.validationToken,
  userController.deleteUser
);

// generate or delete volatile verification code
router.patch('/volatile-verification',
  tokenValidation.validationToken,
  userController.updateVolatileVerificationCode
);

module.exports = router;
