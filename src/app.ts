import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookies from "cookie-parser";
import HTTP from "node:http";
import path from "node:path";
import passport from "passport";
import { Log, AppHelper, SocketAppHelper } from "@/helpers";
import { SwaggerApp } from "@/swagger";
import { Config, IConfigKey } from "@/config";
import { ErrorHelperMiddleware, MorganLogMiddleware, PassportJWTMiddleware } from "@/middleware";
import GraphQLServer from "@/api/graphql/Graphql.server";
import MongoDBConnection from "@/database/mongodb/connection/Mongo.connection";
import routes from "@/routes";

class ExpressEngine {
  public static App: express.Application;
  public static HttpServer: HTTP.Server;

  public static async run(): Promise<void> {
    if (!(await AppHelper.validate())) process.exit(1);
    await ExpressEngine.startEngine().then(AppHelper.signalListening).catch(Log.error);
  }

  public static async startEngine(): Promise<express.Application> {
    ExpressEngine.App = express();
    ExpressEngine.HttpServer = HTTP.createServer(ExpressEngine.App);
    ExpressEngine.App.set("HttpServer", ExpressEngine.HttpServer);
    ExpressEngine.App.set("port", Config.get<number>(IConfigKey.PORT));
    ExpressEngine.HttpServer.on("error", AppHelper.serverErrorListening);
    ExpressEngine.HttpServer.on("close", Log.info);
    ExpressEngine.HttpServer.on(
      "listening",
      async () => await AppHelper.listening(ExpressEngine.HttpServer).then(ExpressEngine.initialize)
    );
    ExpressEngine.HttpServer.listen(Config.get<number>(IConfigKey.PORT));
    return ExpressEngine.App;
  }

  private static async initialize(): Promise<void> {
    // await MongoDBConnection.connect();
    await ExpressEngine.initializeMiddleware();
    await ExpressEngine.setupRequestMiddleware();
    await ExpressEngine.initializeRoutes();
    await ExpressEngine.initializeSwaggerDocs();
    await ExpressEngine.initializeSocket();
    await ExpressEngine.initializeGraphQLServer();
    await ExpressEngine.initializeGlobalMiddleware();
  }

  private static async initializeMiddleware(): Promise<void> {
    this.App.use(express.urlencoded({ limit: "6kb", extended: true }));
    this.App.use(express.json({ limit: "6kb" }));
    this.App.use(new MorganLogMiddleware().success);
    this.App.use(new MorganLogMiddleware().error);
    this.App.use("/upload", express.static(path.resolve("src", "upload")));
    this.App.use(
      cors({
        origin: "*",
        methods: ["GET", "HEAD", "PUT", "OPTIONS", "PATCH", "POST", "DELETE"]
      })
    );
    this.App.use(helmet({ contentSecurityPolicy: false }));
    this.App.use(cookies());
  }

  private static async setupRequestMiddleware(): Promise<void> {
    this.App.use((req: Request, res: Response, next: NextFunction) => {
      req.entity ??= {};
      next();
    });
  }

  private static async initializeRoutes(): Promise<void> {
    this.App.use(passport.initialize());
    passport.use(new PassportJWTMiddleware().JWTStrategy);
    this.App.use("/health", AppHelper.useAppHealthRoute);
    this.App.use(routes);
  }

  private static async initializeSwaggerDocs(): Promise<void> {
    await new SwaggerApp(ExpressEngine).initialize().then(Log.info).catch(Log.error);
  }

  private static async initializeSocket(): Promise<void> {
    await new SocketAppHelper(ExpressEngine).initialize().then(Log.info).catch(Log.error);
  }

  private static async initializeGraphQLServer(): Promise<void> {
    await new GraphQLServer(ExpressEngine).initialize().then(Log.info).catch(Log.error);
  }

  private static async initializeGlobalMiddleware(): Promise<void> {
    this.App.use("*", AppHelper.useAppNotFoundRoute);
    this.App.use(ErrorHelperMiddleware.use);
  }
}

export default ExpressEngine;
