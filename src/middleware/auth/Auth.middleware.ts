import { Request, Response, NextFunction } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { ApiAsyncHelper, ApiErrorResponseHelper } from "@/helpers";
import { IUser } from "@/helpers/interfaces/User.definations";

class AuthHelperMiddleware {
  public static use = ApiAsyncHelper.AsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const { headers } = req;
      if (!headers.authorization?.includes("Bearer")) {
        throw new ApiErrorResponseHelper(
          StatusCodes.UNAUTHORIZED,
          getReasonPhrase(StatusCodes.UNAUTHORIZED),
          "Unauthorised request! access token is missing"
        );
      }

      const user: IUser = {
        name: "Hardy",
        email: "info@mail.com"
      };
      req.entity.user = user;
      next();
    }
  );
}

export default AuthHelperMiddleware;
