import { Request, Response, NextFunction } from "express";
import { ApiAsyncHelper, ApiErrorResponseHelper, PermissionsHelper } from "@/helpers";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

class RoleMiddleware {
  public static readonly role = (permission: string) =>
    ApiAsyncHelper.AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const role = req.entity.user ? "bold" : "ANONYMOUES";
      const permissions = await new PermissionsHelper().getPermissionsByRoleName(role);
      if (permissions.includes(permission)) {
        return next();
      }
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(
          new ApiErrorResponseHelper(
            StatusCodes.FORBIDDEN,
            getReasonPhrase(StatusCodes.FORBIDDEN),
            "Access denied! you don't have permission to access this route"
          )
        );
    });
}

export default RoleMiddleware;
