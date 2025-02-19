import * as winston from "winston";
import { ApiErrorResponseHelper } from "@/helpers";
import { date } from "@/utils";

export type Logger = winston.Logger;
class LoggerHelper {
  static print(): Logger {
    return winston.createLogger({
      level: process.env.LOG_LEVEL,
      levels: winston.config.npm.levels,
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize({
          level: true,
          message: true,
          colors: {
            error: "red",
            info: "green",
            debug: "green",
            warn: "yellow",
            http: "blue"
          }
        }),
        winston.format.timestamp({
          format: date()
        }),
        winston.format.simple(),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const printMessage = `[${info.timestamp}] [${info.level}]: ${info.message}`;
          if (info.metadata) {
            if (info.metadata instanceof ApiErrorResponseHelper) {
              const { errors } = info.metadata;
              const [data] = errors;
              const { message, extensions: { stacktrace, code } = {} } = data;
              const errorMessage = JSON.stringify({ code, message, stacktrace }, null, 2);
              return `${printMessage} | ${errorMessage}`;
            }
            if (typeof info.metadata === "object") {
              const message = JSON.stringify(info.metadata, null, 2);
              return `${printMessage} | ${message}`;
            }
            if (typeof info.metadata === "number") {
              return `${printMessage} | ${info.metadata}`;
            }
            return `${printMessage} | ${info.metadata}`;
          }
          return printMessage;
        })
      )
    });
  }

  public static info(message: string): void;
  public static info<T>(message: string, metadata?: T): void;
  public static info<T>(message: string, metadata?: T) {
    LoggerHelper.print().info(message, { metadata });
  }

  public static debug(message: string): void;
  public static debug<T>(message: string, metadata: T): void;
  public static debug<T>(message: string, metadata?: T) {
    LoggerHelper.print().debug(message, { metadata });
  }

  public static error(message: string): void;
  public static error<T>(message: string, metadata?: T): void;
  public static error<T>(message: string, metadata?: T) {
    LoggerHelper.print().error(message, { metadata });
  }

  public static warn(message: string): void;
  public static warn<T>(message: string, metadata?: T): void;
  public static warn<T>(message: string, metadata?: T) {
    LoggerHelper.print().warn(message, { metadata });
  }

  public static http(message: string): void;
  public static http(message: string) {
    LoggerHelper.print().http(message);
  }
}

export default LoggerHelper;
