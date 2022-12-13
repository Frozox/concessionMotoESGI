import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io-client";

export type NextApiUserRequest = NextApiRequest & {
  user?: any;
};

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type AuthSocket<T> = Socket<T> & {
  auth: {
    token: string | null;
  };
};