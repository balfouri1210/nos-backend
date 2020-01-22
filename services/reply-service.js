const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const notificationService = require('./notification-service');

module.exports.getPlayerReplyByParentId = async ({ userId, parentId }) => {
  try {
    const targetOpinion = 'player_replies';
    const [replies] = await pool.query(`
      SELECT ${targetOpinion}.id, username, content, parent_comments_id, vote_up_count, vote_down_count, ${targetOpinion}.created_at FROM ${targetOpinion}
      LEFT JOIN users ON ${targetOpinion}.users_id = users.id
      WHERE parent_comments_id='${parentId}'
      ORDER BY ${targetOpinion}.vote_up_count DESC LIMIT 10
    `);

    if (userId !== 'null') {
      const replyVoteHistories = await voteHistoryService.getVoteHistoriesByUserId({
        targetOpinion,
        userId
      });
      replies.forEach(reply => {
        replyVoteHistories.forEach(history => {
          if (history.targetOpinionId === reply.id) {
            reply.isVoted = history.vote;
          }
        });
      });
    }

    return replies;
  } catch (err) {
    throw new Error(errors.GET_COMMENT_FAILED.message);
  }
};

module.exports.addPlayerReply = async ({ userId, playerId, content, parentCommentId, parentAuthorId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Add reply
      const [createdComment] = await connection.query(`
        INSERT INTO player_replies
        (users_id, player_id, content, parent_comments_id)
        VALUES (?, ?, ?, ?)
      `, [userId, playerId, content, parentCommentId]);

      if (!createdComment)
        throw new Error(errors.CREATE_COMMENT_FAILED.message);

      // Increase parent's vote count
      await connection.query(`
        UPDATE player_comments SET reply_count=reply_count+1
        WHERE id='${parentCommentId}'`);

      if (userId !== parentAuthorId) {
        // Register notifications
        await notificationService.addNotification({
          recipientId: parentAuthorId,
          senderId: userId,
          object: 'player',
          objectId: playerId,
          type: 'reply',
          content: content
        });
      }

      return {
        id: createdComment.insertId
      };
    } finally {
      // Add notification
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

