import express, { Request, Response } from "express";
import HTTP from "node:http";
import { AddressInfo } from "node:net";
import { Server } from "socket.io";
import mongoose from "mongoose";
import StatusCodes, { getReasonPhrase } from "http-status-codes";
import { ApiErrorResponseHelper, ApiResponseHelper, Log } from "@/helpers";
import { Config, IConfigKey } from "@/config";
import { ApolloServer } from "@apollo/server";
class AppHelper {
  public static async serverErrorListening(error: NodeJS.ErrnoException): Promise<void> {
    if (error.syscall !== "listen") {
      throw error;
    }

    switch (error.code) {
      case "EACCES":
        Log.info("Requires privileges");
        return process.exit(1);

      case "EADDRINUSE":
        Log.error(`${Config.get<number>(IConfigKey.PORT)} is already in use`);
        return process.exit(1);

      default:
        throw error;
    }
  }

  public static async listening(server: HTTP.Server): Promise<void> {
    const address: AddressInfo = <AddressInfo>server.address();
    Log.info(`Express engine is running on ${address.port} 🚀`);
  }

  public static signalListening(app: express.Application): void {
    const http: HTTP.Server = app.get("HttpServer");
    process
      .on("SIGINT", async () => {
        try {
          http.close();
        } catch (SIGINTError: unknown) {
          if (SIGINTError instanceof Error) {
            Log.error(`Error occurred during shutdown server`, SIGINTError);
          }
        } finally {
          ((global as any).GraphQL as ApolloServer)?.stop();
          ((global as any).IO as Server)?.close();
          ((global as any).MongoDB as typeof mongoose)?.disconnect();
          Log.info(`Express engine and all running instance are shutdown successfully 🌱`);
          process.exit(1);
        }
      })
      .on("SIGTERM", () => {
        if (http) {
          http.close();
        }
      })
      .on("SIGHUP", () => {
        process.kill(process.pid, "SIGTERM");
      })
      .on("uncaughtException", (UncaughtError: Error) => {
        Log.error(`Uncaught Exception thrown`, UncaughtError);
        http.close();
        ((global as any).GraphQL as ApolloServer)?.stop();
        ((global as any).IO as Server)?.close();
        ((global as any).MongoDB as typeof mongoose)?.disconnect();
        process.exit(1);
      })
      .on("unhandledRejection", (UncaughtReason: Error) => {
        Log.error(`Unhandled Rejection thrown`, UncaughtReason);
        process.exit(1);
      });
  }

  public static useAppHealthRoute = (req: Request, res: Response): Response => {
    const { platform, pid, uptime, env } = process;
    return res.status(StatusCodes.OK).json(
      new ApiResponseHelper<Record<string, unknown>>(
        StatusCodes.OK,
        "Welcome to backend! made in NODE with ❤️",
        {
          platform,
          pid,
          uptime: uptime(),
          env: env.NODE_ENV,
          cwd: process.cwd()
        }
      )
    );
  };

  public static useAppNotFoundRoute = (): void => {
    throw new ApiErrorResponseHelper(
      StatusCodes.NOT_FOUND,
      getReasonPhrase(StatusCodes.NOT_FOUND),
      "Request resource not found"
    );
  };

  public static async validate(): Promise<boolean> {
    if (!Config.get<number>(IConfigKey.PORT) || !Config.get<string>(IConfigKey.NODE_ENV)) {
      Log.error<string>(
        "The node env or PORT mapping is missing! Please check the .env file for the correct mapping."
      );
      Log.error<string>("x-----------------------------------------------x");
      Log.error<string>("x==================== ERROR ====================x");
      Log.error<string>("x-----------------------------------------------x");
      return false;
    }
    return true;
  }
}

export default AppHelper;
