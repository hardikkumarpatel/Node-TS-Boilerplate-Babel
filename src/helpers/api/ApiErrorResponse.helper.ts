import { getReasonPhrase, StatusCodes } from "http-status-codes";

export default class ApiErrorResponseHelper extends Error {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public result: null;
  public errors: ErrorCapture[];
  constructor(
    statusCode = 500,
    message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    errors: string,
    stack?: null | string
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.result = null;
    this.errors = [
      {
        message: errors,
        extensions: {
          code: getReasonPhrase(statusCode),
          stacktrace: this.stack ? this.stack.split("\n").map((line) => line.trim()) : []
        }
      }
    ];
  }
}

export interface ErrorCapture {
  message?: string;
  extensions?: Extension;
  [key: string]: any;
}
export interface Extension {
  code?: string;
  stacktrace?: ReadonlyArray<string>;
}
