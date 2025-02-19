import { Response } from "express";
import morgan from "morgan";
import { Log } from "@/helpers";

class MorganLogMiddleware {
  constructor() {
    morgan.token("message", (_, res: Response) => res.locals.message || "");
  }

  public success = morgan("short", {
    skip: (_, res: Response) => res.statusCode >= 400,
    stream: { write: Log.http }
  });
  public error = morgan("short", {
    skip: (_, res: Response) => res.statusCode < 400,
    stream: { write: Log.error }
  });
}

export default MorganLogMiddleware;
