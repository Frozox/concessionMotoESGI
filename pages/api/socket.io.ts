import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "../../lib/types";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket.io",
    });

    // Attach user infos to socket
    io.use((socket, next) => {
      jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET as string, (_: any, decoded: any) => {
        socket.data.user = decoded
        next();
      });
    });

    res.socket.server.io = io;
  }
  res.end()
};
