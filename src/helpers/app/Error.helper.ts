import { Response } from "express";
import { MulterError } from "multer";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { ApiErrorResponseHelper } from "@/helpers";

class ErrorHelper {
  private static json = (code: number, message: string, stack: string | null = null) => {
    return new ApiErrorResponseHelper(code, getReasonPhrase(code), message, stack);
  };

  public static capture(errors: MulterError | Error, res: Response) {
    if (errors instanceof MulterError) {
      if (errors.code === "LIMIT_FILE_SIZE") {
        return res
          .status(StatusCodes.REQUEST_TOO_LONG)
          .send(
            ErrorHelper.json(
              StatusCodes.REQUEST_TOO_LONG,
              "File size is too large. Max size is 1MB"
            )
          );
      } else if (errors.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            ErrorHelper.json(StatusCodes.BAD_REQUEST, "Unexpected files. too many files uploaded")
          );
      } else if ((errors.code as any) === "INVALID_FILE_TYPE") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(ErrorHelper.json(StatusCodes.BAD_REQUEST, errors.field as string));
      } else {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(
            ErrorHelper.json(
              StatusCodes.INTERNAL_SERVER_ERROR,
              "An unknown error occurred during the file upload"
            )
          );
      }
    }
  }
}

export default ErrorHelper;
