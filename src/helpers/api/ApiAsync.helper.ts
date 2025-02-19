import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
class ApiAsyncHelper {
  public static readonly AsyncHandler = (
    handler: AsyncRequestHandler
  ): RequestHandler | ErrorRequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(handler(req, res, next)).catch(next);
    };
  };
}

export default ApiAsyncHelper;
