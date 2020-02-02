const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.post('/', authController.login);
router.post('/account-verification',
  authController.accountVerification
);
router.put('/account-activation',
  authController.accountActivation
);
router.get('/available-email/:email',
  authController.availableEmailChecker
);
router.get('/available-username/:username',
  authController.availableUsernameChecker
);
router.put('/password-reset', authController.passwordReset);

module.exports = router;
