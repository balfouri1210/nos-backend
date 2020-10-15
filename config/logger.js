// Datadog 로깅 구현 참고자료들
// https://docs.datadoghq.com/logs/log_collection/nodejs/?tab=winston30
// https://docs.datadoghq.com/logs/processing/attributes_naming_convention/
// https://github.com/winstonjs/winston/blob/master/docs/transports.md#datadog-transport
// https://velog.io/@ash/Node.js-%EC%84%9C%EB%B2%84%EC%97%90-logging-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-winston-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0

// 원래 winston은 로그 파일을 생성하는 용도로 많이 사용하지만
// 나는 datadog 문서를 참고하여 파일생성이 아니라 datadog에 직접 로그를 등록하는 방식으로 구현했다.
// 파일을 생성하고, datadog으로 파싱할수도 있는것으로 보이지만 별로 필요성을 못느꼈다.

const winston = require('winston');
const requestIp = require('request-ip');

const { combine, timestamp, printf } = winston.format;

const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: '/v1/input/a490e5ad9c63565969970b4769e603d7?ddsource=nodejs&service=907degrees',
  ssl: true
};

// Define log format
const logFormat = printf(info => {
  return `${info.timestamp} [${info.ipAddress}] ${info.level}: ${info.message}`;
});

const createLog = function(type, message, req) {
  if (type === 'info') {
    logger.info(message, {
      // 'network.client.ip': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      // 'network.client.geoip': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      'network.client.ip': requestIp.getClientIp(req),
      'http.method': req.method,
      'http.useragent': req.headers['user-agent']
    });
  } else if (type === 'error') {
    logger.error(message, {
      'network.client.ip': requestIp.getClientIp(req),
      'http.method': req.method,
      'http.useragent': req.headers['user-agent']
    });
  }
};

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),

  defaultMeta: { service: 'user-service' },

  // 로그등록
  transports: [
    new winston.transports.Http(httpTransportOptions)
  ],

  // unhandled error를 알아서 캐치해서 등록해준다
  exceptionHandlers: [
    new winston.transports.Http(httpTransportOptions)
  ]
});

// Production 환경이 아닌 경우(dev 등) 
if (process.env.STAGE !== 'prod') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),  // 색깔 넣어서 출력
      winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    )
  }));
}

module.exports = createLog;
  