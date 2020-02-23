const schedule = require('node-schedule');

module.exports.refreshScheduler =
schedule.scheduleJob({
  // Do Something every friday 18:00
  rule: '0 18 * * FRI',
  tz: 'Europe/London'
}, () => {
  console.log('node-schedule 실행 테스트');
});