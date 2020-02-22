const schedule = require('node-schedule');

// second minute hour day-of-month month day-of-week
module.exports.makeSortedCommentTableScheduler =
schedule.scheduleJob('*/30 * * * *', () => {
  console.log('node-schedule 실행 테스트');
});