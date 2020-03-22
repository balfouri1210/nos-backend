const schedule = require('node-schedule');
const commentService = require('../services/comment-service');
const replyService = require('../services/reply-service');
const playerService = require('../services/player-service');
const historiesService = require('../services/histories-service');
const historyTerm = 1000 * 60 * 60 * 24 * 7;

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
      replyService.emptyPlayerReplies()
    ]);
  } catch (err) {
    console.error(err);
    throw new Error(err.message || err);
  } finally {
    console.log('schedule worker done!');
  }
}

// Remember - in JavaScript: 0 - January, 11 - December.
// 정기작업이 시작될 날짜를 지정한다.
const date = new Date(Date.UTC(2020, 2, 21, 17, 15));

module.exports.historyScheduler =
schedule.scheduleJob(date, () => {
  // 정기작업
  schedulerWorker();

  // 정기작업이 반복될 텀을 지정한다.
  setInterval(schedulerWorker, historyTerm);
});

// 특별한 이벤트 없이, 매주 금요일 18시 (UTC)에 작업을 하고 싶으면
// 이 스케줄러를 사용하면 된다.
// module.exports.leaderBoardScheduler =
// schedule.scheduleJob({
//   // Do Something every friday 18:00
//   rule: '0 18 * * FRI',
//   tz: 'Europe/London'
// }, () => {
//   console.log('node-schedule 실행 테스트');
// });