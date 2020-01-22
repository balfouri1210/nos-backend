const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getNotificationsByRecipientId = async ({ recipientId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [notifications] = await connection.query(`
        SELECT sender_id, username, object, object_id, type, content, is_read, notifications.created_at
        FROM notifications
        LEFT JOIN users ON notifications.sender_id = users.id
        WHERE recipient_id='${recipientId}'
        ORDER BY notifications.id DESC LIMIT 10
      `);
      if (!notifications) throw new Error(errors.GET_NOTIFICATION_FAILED.message);

      await connection.query(`
        UPDATE notifications SET
        is_read='1'
        WHERE recipient_id='${recipientId}'
      `);

      return notifications;
    } catch (err) {
      throw new Error(err);
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.getUnreadNotifications = async ({ recipientId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      const [unreadNotificationCount] = await connection.query(`
        SELECT COUNT(*) AS COUNT FROM notifications WHERE (recipient_id='${recipientId}') AND (is_read='0')
      `);

      if (!unreadNotificationCount) throw new Error(errors.GET_NOTIFICATION_FAILED.message);

      return {
        unreadNotificationCount: unreadNotificationCount[0].COUNT
      };
    } catch (err) {
      throw new Error(err);
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};


module.exports.addNotification = async ({ recipientId, senderId, object, objectId, type, content }) => {
  // Prevent case that recipient and sender are the same
  if (recipientId !== senderId) {
    try {
      const connection = await pool.getConnection();

      try {
        // Update comment vote_count
        const addNotificationSql = `
          INSERT INTO notifications (recipient_id, sender_id, object, object_id, type, content)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [recipientId, senderId, object, objectId, type, content];
        const [addedNotification] = await connection.query(addNotificationSql, params);
        if (!addedNotification) throw new Error(errors.ADD_NOTIFICATION_FAILED.message);

        return {
          addedNotification
        };
      } catch (err) {
        throw new Error(err);
      } finally {
        connection.release();
      }
    } catch (err) {
      throw new Error(err.message || err);
    }
  }
};
