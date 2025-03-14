import express from "express";
import HTTP from "node:http";
import expressBasicAuth from "express-basic-auth";
import { ApolloServer } from "@apollo/server";
import { Config, IConfigKey } from "@/config";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import GraphQLSchemaDef from "@/api/graphql/schema";
import GraphQLSchemaResolvers from "@/api/graphql/resolvers";
import ExpressEngine from "@/app";

class GraphQLServer {
  private app: express.Application;
  public httpServer: HTTP.Server;
  constructor(app: typeof ExpressEngine) {
    this.app = app.App;
    this.httpServer = app.HttpServer;
  }

  public async initialize(): Promise<string> {
    const graphQLServer = new ApolloServer({
      typeDefs: new GraphQLSchemaDef().get(),
      resolvers: new GraphQLSchemaResolvers().get(),
      nodeEnv: Config.get<string>(IConfigKey.NODE_ENV),
      includeStacktraceInErrorResponses: true,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })]
    });
    await graphQLServer.start();
    this.app.set("GraphQL", graphQLServer);
    (global as any).GraphQL = graphQLServer;
    this.app.use(
      "/graphql",
      expressBasicAuth({
        users: {
          root: "deamon"
        },
        challenge: true
      })
    );
    this.app.use(
      "/graphql",
      expressMiddleware(graphQLServer, {
        context: async ({ req }) => ({ token: req.headers.token })
      })
    );
    return `GraphQL server is running at http://localhost:${Config.get<number>(IConfigKey.PORT)}/graphql 🚀`;
  }
}

export default GraphQLServer;
