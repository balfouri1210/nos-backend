const pool = require('../database/db-connection');
const { errors } = require('../constants/index');
const { extractUserInfoFromJWT } = require('./auth-service');
const voteHistoryService = require('./vote-history-service');

module.exports.getPlayers = async (
  { previousPlayerIdList, size }
) => {
  try {
    previousPlayerIdList = previousPlayerIdList || '""';
    size = size || 20;

    const [players] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code FROM players
      LEFT JOIN countries ON players.nationality = countries.id
      WHERE players.id NOT IN (${previousPlayerIdList.toString()})
      ORDER BY players.hits + players.vote_up_count + players.vote_down_count + players.comment_count DESC, players.id DESC
      LIMIT ${size}
    `);

    return players;
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_PLAYERS_FAILED.message);
  }
};

module.exports.getPlayerByID = async (
  authorization,
  { playerId }
) => {
  try {
    const [player] = await pool.query(`
      SELECT players.*, countries.name as country_name, countries.code as country_code,
      clubs.name as club_name, clubs.image as club_image,
      leagues.id as league_id
      FROM players
      LEFT JOIN countries ON players.nationality = countries.id
      LEFT JOIN clubs ON players.club_team_id = clubs.id
      LEFT JOIN leagues ON clubs.leagues_id = leagues.id
      WHERE players.id = ${playerId}
    `);

    let result = player[0];

    if (authorization) {
      const { userId } = extractUserInfoFromJWT(authorization);

      // 유저가 이미 투표한 player인지 검사
      const playerVoteHistory = await voteHistoryService.getPlayerVoteHistoriesByUserId({
        userId,
        playerId
      });

      // 플레이어 투표 내역에 해당 플레이어가 있으면 isVoted에 할당해서 프론트로 리턴
      if (playerVoteHistory) result.isVoted = playerVoteHistory.vote;
    }

    return player[0];
  } catch (err) {
    console.error(err);
    throw new Error(errors.GET_PLAYER_BY_ID_FAILED.message);
  }
};

module.exports.increasePlayerHits = async (
  { playerId }
) => {
  try {
    await pool.query(`
      UPDATE players SET hits=hits+1
      WHERE id='${playerId}'
    `);

    return;
  } catch (err) {
    console.error(err);
    throw new Error(errors.INCREASE_PLAYER_HITS_FAILED.message);
  }
};

module.exports.increasePlayerCommentsCount = async (
  playerId, type
) => {
  try {
    let query = type === 'increase' ? 'comment_count+1' : 'comment_count-1';
    await pool.query(`
      UPDATE players SET comment_count=${query}
      WHERE id='${playerId}'
    `);

    return;
  } catch (err) {
    console.error(err);
    throw new Error(errors.INCREASE_PLAYER_HITS_FAILED.message);
  }
};



