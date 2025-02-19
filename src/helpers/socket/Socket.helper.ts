import { Request } from "express";
import { DisconnectReason, Server, Socket } from "socket.io";
import { Log } from "@/helpers";
import ExpressEngine from "@/app";

class SocketAppHelper {
  public IO: Server;
  constructor(app: typeof ExpressEngine) {
    this.IO = new Server(app.HttpServer, {
      cors: {
        origin: "*"
      },
      connectionStateRecovery: {},
      allowEIO3: true
    });
    app.App.set("IO", this.IO);
    (global as any).IO = this.IO;
  }

  public async initialize(): Promise<string> {
    this.IO.on("connection", async (socket: Socket) => {
      try {
        Log.info(`Socket is connected ${socket.id}`);

        socket.on("disconnect", (reason: DisconnectReason) => {
          Log.error<string>(`socket ${socket.id} disconnected due to`, reason);
        });
      } catch (SocketException: unknown) {
        if (SocketException instanceof Error) {
          Log.error<Error>("Error ocurred in socket app", SocketException);
        }
      }
    });
    return `Socket engine connected and initialized 🚀`;
  }

  public static async emitSocketEvents<T>(
    req: Request,
    room: string,
    event: string,
    payload: T
  ): Promise<void> {
    const IO: Server = req.app.get("IO");
    IO.in(room).emit(event, payload);
  }

  public static acknowledgment(callback?: (response: { status: string }) => void): void {
    if (callback && typeof callback === "function") {
      callback({ status: "OK" });
    }
  }
}

export default SocketAppHelper;
