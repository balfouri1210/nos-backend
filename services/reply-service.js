const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');
const notificationService = require('./notification-service');
const { extractUserInfoFromJWT } = require('./auth-service');

module.exports.getPlayerReplyByparentCommentId = async (
  authorization,
  { parentCommentId },
  { maxId }
) => {
  try {
    const table = 'player_replys';
    const howManyReplyEachRequest = 10;
    maxId = maxId || 0;

    const [replies] = await pool.query(`
      SELECT ${table}.id, ${table}.user_id, username, content,
      parent_comment_id, vote_up_count, vote_down_count, ${table}.created_at
      FROM ${table}
      LEFT JOIN users ON ${table}.user_id = users.id
      WHERE parent_comment_id=${parentCommentId} AND ${table}.id>${maxId}
      ORDER BY ${table}.id
      LIMIT ${howManyReplyEachRequest}
    `);

    const { userId } = extractUserInfoFromJWT(authorization);

    if (userId !== 'null') {
      const replyVoteHistories = await voteHistoryService.getOpinionVoteHistoriesByUserId({
        targetOpinion: 'player_reply',
        userId
      });

      replies.forEach(reply => {
        replyVoteHistories.forEach(history => {
          if (history.targetOpinionId === reply.id) {
            reply.vote = history.vote;
          }
        });
      });
    }

    return replies;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_REPLY_FAILED.message);
  }
};

module.exports.addPlayerReply = async (authorization, { playerId, content, parentCommentId, parentAuthorId }) => {
  try {
    const connection = await pool.getConnection();
    const { userId } = extractUserInfoFromJWT(authorization);

    try {
      // Add reply
      const [createdComment] = await connection.query(`
        INSERT INTO player_replys
        (user_id, player_id, content, parent_comment_id)
        VALUES (?, ?, ?, ?)
      `, [userId, playerId, content, parentCommentId]);

      if (!createdComment)
        throw new Error(errors.CREATE_REPLY_FAILED.message);

      // Increase parent's reply count
      await connection.query(`
        UPDATE player_comments SET reply_count=reply_count+1
        WHERE id='${parentCommentId}'
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
      // ' (apostrophe) 가 포함되면 mysql syntax error가 발생하기 때문. \'로 대체한다
      newContent = newContent.replace(/'/g, "\\'");

      // Query
      const [edittedReply] = await connection.query(`
        UPDATE player_replys SET
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

// 특정 reply만 삭제하는 함수
module.exports.deletePlayerReply = async ({ replyId }, { parentCommentId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const [deletedReply] = await connection.query(`
        DELETE FROM player_replys
        WHERE id='${replyId}'
      `);

      if (!deletedReply)
        throw new Error(errors.DELETE_REPLY_FAILED.message);


      const decreaseParentReplyCount = () => {
        return connection.query(`
          UPDATE player_comments SET reply_count=reply_count-1
          WHERE id='${parentCommentId}'
        `);
      };
      const deleteReplyVoteHistories = () => {
        return connection.query(`
          DELETE FROM player_reply_vote_histories
          WHERE player_reply_id=${replyId}
        `);
      };
  
      await Promise.all([ decreaseParentReplyCount(), deleteReplyVoteHistories() ]);

      return deletedReply;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};

// Comment를 지웠을 때, 그 comment에 달린 reply들을 삭제하는 함수.
module.exports.deletePlayerReplyByParentCommentId = async (parentCommentId) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      let [targetReplies] = await connection.query(`
        SELECT id FROM player_replys
        WHERE parent_comment_id='${parentCommentId}'
      `);

      if (!targetReplies[0]) return;

      targetReplies = targetReplies.map(reply => {
        return reply.id;
      }).join(',');

      const deleteTargetReplies = () => {
        return connection.query(`
          DELETE FROM player_replys
          WHERE id IN (${targetReplies})
        `);
      };
      const deleteTargetReplyVoteHistories = () => {
        return connection.query(`
          DELETE FROM player_reply_vote_histories
          WHERE player_reply_id IN (${targetReplies})
        `);
      };
  
      await Promise.all([ deleteTargetReplies(), deleteTargetReplyVoteHistories() ]);

      return;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  }
};



// 프론트엔드와 단절된 함수들
module.exports.replyMigrationToHistories = async (historyId) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      await connection.query(`
        INSERT INTO player_reply_histories 
        (history_id, id, user_id, player_id, parent_comment_id, content, vote_up_count, vote_down_count, created_at, updated_at)
        SELECT ${historyId}, id, user_id, player_id, parent_comment_id, content, vote_up_count, vote_down_count, created_at, updated_at
        FROM player_replys
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

module.exports.emptyPlayerReplies = async () => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      await connection.query(`
        DELETE FROM player_replys
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
