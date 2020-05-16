const schedule = require('node-schedule');
const commentService = require('../services/comment-service');
const replyService = require('../services/reply-service');
const playerService = require('../services/player-service');
const historiesService = require('../services/histories-service');
const voteHistoriesService = require('../services/vote-histories-service');
const notificationService = require('../services/notification-service');
const historyTerm = 7;

// 정기작업
async function schedulerWorker() {
  console.log('schedule worker executed!');

  try {
    const insertedHistoryId = await historiesService.addHistories(historyTerm);

    await Promise.all([
      playerService.top100PlayersMigrationToHistories(insertedHistoryId),
      commentService.commentMigrationToHistories(insertedHistoryId),
      replyService.replyMigrationToHistories(insertedHistoryId)
    ]);

    await Promise.all([
      playerService.initiatePlayers(),
      commentService.emptyPlayerComments(),
      replyService.emptyPlayerReplies(),

      voteHistoriesService.truncateOpinionVoteHistory('player_comments'),
      voteHistoriesService.truncateOpinionVoteHistory('player_replies'),
      voteHistoriesService.truncatePlayerVoteHistory(),

      notificationService.emptyNotifications()
    ]);
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  } finally {
    console.log('schedule worker done!');
  }
}

// ### 리더보드 리셋 주기를 직접 설정하고 싶을 때 ###
// Remember - in JavaScript: 0 - January, 11 - December.

// // 정기작업이 시작될 날짜를 지정한다.
// const date = new Date(Date.UTC(2020, 2, 25, 1, 5));

// // 정기작업을 실행한다.
// module.exports.historyScheduler =
// schedule.scheduleJob(date, () => {
//   // 정기작업
//   schedulerWorker();

//   // 정기작업이 반복될 텀을 지정한다.
//   setInterval(schedulerWorker, 1000 * 60 * 60 * 24 * historyTerm);
// });


// ### 특별한 이벤트 없이, 매주 금요일 18시 (UTC)에 작업을 하고 싶을 때 ###
module.exports.historyScheduler =
schedule.scheduleJob({
  // *    *    *    *    *    *
  // ┬    ┬    ┬    ┬    ┬    ┬
  // │    │    │    │    │    │
  // │    │    │    │    │    └ day of week (0 - 7) (0, 7 은 일요일)
  // │    │    │    │    └───── month (1 - 12)
  // │    │    │    └────────── day of month (1 - 31)
  // │    │    └─────────────── hour (0 - 23)
  // │    └──────────────────── minute (0 - 59)
  // └───────────────────────── second (0 - 59, OPTIONAL)

  rule: '0 18 * * FRI',
  tz: 'GMT' // 'Europe/London'은 서머타임때 1시간이 추가되므로 GMT로 대체함
}, () => {
  console.log('node scheduler!');
  schedulerWorker();
});