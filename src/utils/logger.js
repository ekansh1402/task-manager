const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "http",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: "HH:mm:ss:ms" }),
        winston.format.colorize(),
        winston.format.printf((info) => {
          const req_id = info.message.req_id || "";
          const request = info.message.path || "";

          return `${info.timestamp} ${info.level}: - Path: ${request}, Req ID: ${req_id}`;
        })
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: "logs/%DATE%-app.log",
      level: "http",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
        winston.format.printf((info) => {
          const req_id = info.message.req_id || "";
          const request = info.message.path || "";
          const response = info.message.response
            ? JSON.stringify(info.message.response)
            : "";

          return `${info.timestamp} ${info.level}: - Path: ${request}, Req ID: ${req_id}, Response: ${response}`;
        })
      ),
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
