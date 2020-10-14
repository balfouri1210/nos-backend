const winston = require('winston');
const requestIp = require('request-ip');

const logDir = 'logs';  // logs 디렉토리 하위에 로그 파일 저장
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
      'network.client.geoip': requestIp.getClientIp(req),
      'http.method': req.method,
      'http.useragent': req.headers['user-agent']
    });
  } else if (type === 'error') {
    logger.error(message, {
      'network.client.ip': requestIp.getClientIp(req),
      'network.client.geoip': requestIp.getClientIp(req),
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

  transports: [
    new winston.transports.Http(httpTransportOptions)
    // new winston.transports.File({ filename: `${logDir}/combined.log` })
  ],

  exceptionHandlers: [
    new winston.transports.Http(httpTransportOptions)
    // new winston.transports.File({ filename: `${logDir}/exceptions.log` })
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
  