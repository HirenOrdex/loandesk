import winston from "winston";
import { format } from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import os from "os";
import { LOG_DIR } from "./envConfigs";

let logDir = LOG_DIR?.trim(); // Sanitize the value

try {
  if (!logDir) {
    console.warn("LOG_DIR not defined. Falling back...");
    logDir = path.join(os.homedir(), "test");
  }

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log(`Directory created at: ${logDir}`);
  }
} catch (error) {
  console.error(
    `Failed to create or access log directory at ${logDir}:`,
    error
  );

  // Fallback to home directory
  const fallbackLogDir = path.join(os.homedir(), "test");
  logDir = fallbackLogDir;

  try {
    if (!fs.existsSync(fallbackLogDir)) {
      fs.mkdirSync(fallbackLogDir, { recursive: true });
      console.log(`Fallback directory created at: ${fallbackLogDir}`);
    }
  } catch (fallbackError) {
    console.error(
      `Also failed to create fallback log directory:`,
      fallbackError
    );
  }
}

// Create a DailyRotateFile transport with the new directory
const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "logs-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const customFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  format: format.combine(format.timestamp(), customFormat),
  transports: [transport],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
      level: "error",
    }),
  ],
});
