const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const voteHistoryService = require('./vote-history-service');

module.exports.getPlayerReplyByParentId = async ({ userId, parentId }) => {
  try {
    const targetOpinion = 'player_replies';
    const [replies] = await pool.query(`
      SELECT ${targetOpinion}.id, username, content, parent_id, vote_up_count, vote_down_count, ${targetOpinion}.created_at FROM ${targetOpinion}
      LEFT JOIN users ON ${targetOpinion}.users_id = users.id
      WHERE parent_id='${parentId}'
      ORDER BY ${targetOpinion}.vote_up_count DESC LIMIT 10`
    );

    if (userId !== 'null') {
      const replyVoteHistories = await voteHistoryService.getVoteHistoriesByUserId(`${targetOpinion}`, userId);
      replies.forEach(reply => {
        replyVoteHistories.forEach(history => {
          if (history.targetId === reply.id) {
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

module.exports.addPlayerReply = async ({ userId, playerId, content, parentId }) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Query
      const insertSql = 'INSERT INTO player_replies (users_id, player_id, content, parent_id) VALUES (?, ?, ?, ?)';
      const params = [userId, playerId, content, parentId];
      const [createdComment] = await connection.query(insertSql, params);

      if (!createdComment) {
        throw new Error(errors.CREATE_COMMENT_FAILED.message);
      }

      await pool.query(`UPDATE player_comments SET reply_count=reply_count+1 WHERE id='${parentId}'`);

      return {
        id: createdComment.insertId
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    throw new Error(err.message || err);
  }
};

