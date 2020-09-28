const constants = require('../constants');

// 원하지 않는 origin 에서 요청이 올 경우 막기 위한 미들웨어다.
// 예를들어 postman이나 기타 서버를 통해 무분별한 요청을 할 경우를 대비한 것.
// (ex. 하나의 jwt로 무한 투표 가능)

// origin이 undefined일 경우만 생각하면 cors에서도 막을 수 있지만
// Nuxt의 서버사이드에서 요청할 경우 역시 origin이 undefined이기 때문에
// 똑같이 취급하여 막아버리게 된다.
// 그 결과 프론트에서 새로고침하면 cors에 막히고 (serverside rendering) -> 에러페이지가 떠버린다.

// 방법을 생각하다보니 nuxt의 asyncData에서는 get요청만 발생하기 떄문에
// (다른 요청을 할 수도 있지만 그런경우는 아직 없음)
// cors모듈에서 origin이 undefined이고, method가 post, put, delete인 경우만
// 골라서 막을 수 있는지 알아봤다. but cors모듈에서 parameter로 origin과 method를
// 동시에 받을 수 있는 방법을 찾지 못했다.
// 그래서 일단 이 미들웨어로 origin이 undefined이고, [post, put, delete]와 같이
// 중요한 요청이 들어올 경우 요청을 막기로 했다.
// (위에서도 말했듯이, nuxt의 서버사이드에서는 get요청만 발생하기 때문에 문제가 없다는 판단이다.)
module.exports.validateOrigin = (req, res, next) => {
  if (!req.headers.origin) {
    throw new Error(constants.errors.NOW_ALLOWED_ORIGIN.message);
  } else {
    return next();
  }
};
