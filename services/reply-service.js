const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const notificationService = require('./notification-service');
const { extractUserIdFromJWT } = require('./auth-service');

module.exports.getPlayerReplyByParentCommentsId = async (authorization, { parentCommentsId }, { page }) => {
  try {
    const targetOpinion = 'player_replies';
    const howManyReplyEachRequest = 10;
    const replyPage = page || 1;
    const [replies] = await pool.query(`
      SELECT ${targetOpinion}.id, ${targetOpinion}.users_id, username, content, parent_comments_id, vote_up_count, vote_down_count, ${targetOpinion}.created_at FROM ${targetOpinion}
      LEFT JOIN users ON ${targetOpinion}.users_id = users.id
      WHERE parent_comments_id='${parentCommentsId}'
      ORDER BY ${targetOpinion}.vote_up_count DESC, ${targetOpinion}.vote_down_count, ${targetOpinion}.id
      LIMIT ${howManyReplyEachRequest} OFFSET ${howManyReplyEachRequest * (replyPage - 1)}
    `);

    const userId = extractUserIdFromJWT(authorization);

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
    throw new Error(errors.GET_REPLY_FAILED.message);
  }
};

module.exports.addPlayerReply = async ({ userId, playerId, content, parentCommentsId, parentAuthorId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Add reply
      const [createdComment] = await connection.query(`
        INSERT INTO player_replies
        (users_id, player_id, content, parent_comments_id)
        VALUES (?, ?, ?, ?)
      `, [userId, playerId, content, parentCommentsId]);

      if (!createdComment)
        throw new Error(errors.CREATE_REPLY_FAILED.message);

      // Increase parent's vote count
      await connection.query(`
        UPDATE player_comments SET reply_count=reply_count+1
        WHERE id='${parentCommentsId}'
      `);

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

module.exports.editPlayerReply = async ({ replyId }, { newContent }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const [edittedReply] = await connection.query(`
        UPDATE player_replies SET
        content='${newContent}'
        WHERE id='${replyId}'
      `);

      if (!edittedReply) {
        throw new Error(errors.EDIT_REPLY_FAILED.message);
      }

      return edittedReply;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

module.exports.deletePlayerReply = async ({ replyId }, { parentCommentsId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const [deletedReply] = await connection.query(`
        DELETE FROM player_replies
        WHERE id='${replyId}'
      `);

      if (!deletedReply)
        throw new Error(errors.DELETE_REPLY_FAILED.message);

      // Decrease parent's vote count
      await connection.query(`
        UPDATE player_comments SET reply_count=reply_count-1
        WHERE id='${parentCommentsId}'
      `);

      return deletedReply;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

