const express = require('express');
const router = express.Router();
const tokenValidation = require('../middleware/token-validation');
const notificationController = require('../controllers/notification-controller.js');

router.get('/:recipientId',
  tokenValidation.validationToken,
  notificationController.getNotificationsByRecipientId
);

router.get('/unread/:recipientId',
  tokenValidation.validationToken,
  notificationController.getUnreadNotifications
);

module.exports = router;
