const notificationService = require('../services/notification-service');
const { errors, defaultServerResponse } = require('../constants/index');

module.exports.getNotificationsByRecipientId = async (req, res) => {
  try {
    const result = await notificationService.getNotificationsByRecipientId(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};

module.exports.getUnreadNotifications = async (req, res) => {
  try {
    const result = await notificationService.getUnreadNotifications(
      req.params
    );
    res.send(result);
  } catch (err) {
    res.status(400).send(errors[err.message] || defaultServerResponse);
  }
};
