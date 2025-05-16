import winston, { createLogger, transports } from "winston";
import { format } from "winston";
import "winston-daily-rotate-file";


const myFormat = format.printf((info) => {
  return `${info.timestamp}: ${info.level}: ${info.message}`;
});

export const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/appLogs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '15d',
      format: format.combine(format.timestamp(), myFormat)
    }),
  ],
  exitOnError: false,
});

export const queryLogger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/queryLogs/query-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '15d',
      format: format.combine(format.timestamp(), myFormat)
    }),
  ],
  exitOnError: false,
});