import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { ApiErrorResponseHelper, ErrorHelper, Log } from "@/helpers";
import { Config } from "@/config";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { ErrorCapture } from "@/helpers/api/ApiErrorResponse.helper";
class ErrorHelperMiddleware {
  public static use = (
    errors: ApiErrorResponseHelper,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    /** Handle file uploads and address any unhandled errors. */
    if (errors instanceof MulterError) {
      return ErrorHelper.capture(errors, res);
    }

    /** Handle APIs errors */
    let error = errors as ApiErrorResponseHelper;
    if (!error.statusCode) {
      error = new ApiErrorResponseHelper(
        StatusCodes.INTERNAL_SERVER_ERROR,
        getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        errors.message,
        errors.stack
      );
    }
    if (Config.isDev()) {
      Log.error<ApiErrorResponseHelper>("", error);
    }
    if (Config.isProduction()) {
      error.errors.map((err: ErrorCapture) => delete err.extensions?.stacktrace);
    }
    const response = {
      ...error
    };
    return res.status(error.statusCode).json(response);
  };
}

export default ErrorHelperMiddleware;
