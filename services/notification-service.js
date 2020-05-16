const pool = require('../database/db-connection');
const { errors } = require('../constants/index');

module.exports.getNotificationsByRecipientId = async ({ recipientId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // const [notifications] = await connection.query(`
      //   SELECT sender_id, username, object, object_id, type, content, is_read, notifications.created_at
      //   FROM notifications
      //   LEFT JOIN users ON notifications.sender_id = users.id
      //   WHERE recipient_id='${recipientId}'
      //   ORDER BY notifications.id DESC LIMIT 10
      // `);
      // if (!notifications) throw new Error(errors.GET_NOTIFICATION_FAILED.message);

      // noti1, noti2로 나누어서 구현해놓은 이유:
      // 첫 설계부터 notification object를 player, team 두가지로 나누어 구현했는데
      // LEFT JOIN 시에 테이블 이름을 동적으로 할 수 없기 때문이다.
      // player타입은 players테이블과, team타입은 teams테이블과 각각 조인하여 쿼리해야 한다.
      // team 개념이 생기고, team댓글을 달 수 있을 때 주석부분을 활성화하면 된다.
      const [noti1, noti2] = await Promise.all([
        connection.query(`
          SELECT sender_id, username, object, object_id, players.known_as as object_name, type, content, is_read, notifications.created_at
          FROM notifications
          LEFT JOIN users ON notifications.sender_id = users.id
          LEFT JOIN players ON notifications.object_id = players.id
          WHERE recipient_id='${recipientId}' AND object='player'
          ORDER BY notifications.id DESC
        `), 

        // connection.query(`
        //   SELECT sender_id, username, object, object_id, type, content, is_read, notifications.created_at
        //   FROM notifications
        //   LEFT JOIN users ON notifications.sender_id = users.id
        //   LEFT JOIN teams ON notifications.object_id = teams.id
        //   WHERE recipient_id='${recipientId}' AND type='team'
        //   ORDER BY notifications.id DESC
        // `)
      ]);

      await connection.query(`
        UPDATE notifications SET
        is_read='1'
        WHERE recipient_id='${recipientId}'
      `);

      return noti1[0];
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

module.exports.getUnreadNotificationCount = async ({ recipientId }) => {
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

module.exports.emptyNotifications = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      await connection.query(`
        DELETE FROM notifications
      `);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};
