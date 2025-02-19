import { ApiErrorResponseHelper } from "@/helpers";
import { NextFunction, Request, Response } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import passport from "passport";
import {
  Strategy as PassportJwtStrategy,
  ExtractJwt,
  StrategyOptions,
  StrategyOptionsWithoutRequest
} from "passport-jwt";

type VerifiedCallback = (error: any, user?: unknown | false, info?: any) => void;

class PassportJWTMiddleware {
  private JWTOptions: StrategyOptions = {
    secretOrKey: "secret",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  };

  private async verify(payload: Record<string, unknown>, done: VerifiedCallback) {
    try {
      done(null, {});
    } catch (PassportJWTException) {
      done("PassportJWTException", false);
    }
  }

  public JWTStrategy = new PassportJwtStrategy(
    this.JWTOptions as unknown as StrategyOptionsWithoutRequest,
    this.verify
  );

  public static use(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", { session: false }, (error: any, user: any, info: any) => {
      if (!user) {
        if (info.message === "No auth token") {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send(
              new ApiErrorResponseHelper(
                StatusCodes.UNAUTHORIZED,
                getReasonPhrase(StatusCodes.UNAUTHORIZED),
                "Access token is missing! please check the request"
              )
            );
        }
        if (info.name === "TokenExpiredError") {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send(
              new ApiErrorResponseHelper(
                StatusCodes.UNAUTHORIZED,
                getReasonPhrase(StatusCodes.UNAUTHORIZED),
                "Access token is expired"
              )
            );
        } else if (info.name === "JsonWebTokenError") {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .send(
              new ApiErrorResponseHelper(
                StatusCodes.UNAUTHORIZED,
                getReasonPhrase(StatusCodes.UNAUTHORIZED),
                "Invalid access token"
              )
            );
        }
      }
    })(req, res, next);
  }
}

export default PassportJWTMiddleware;
