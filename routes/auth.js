const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.post('/', authController.login);
router.put('/account-verification', authController.accountVerification);

module.exports = router;
