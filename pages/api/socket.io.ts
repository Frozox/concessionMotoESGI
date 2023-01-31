import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "../../lib/types";
import jwt from "jsonwebtoken";
import { exclude, PrismaClientSingleton } from "../../lib/prismaUtils";

const prisma = PrismaClientSingleton.getInstance().prisma;

const socketHandler = async (
  req: NextApiRequest,
  res: NextApiResponseServerIO
) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket.io",
      cors: {
        origin: "http://localhost:8080",
      },
    });

    io.on("connection", async (socket) => {
      if (socket.data.user) {
        await prisma.user.update({
          where: { id: socket.data.user.id },
          data: { online: true },
        });
        socket.on("disconnect", async () => {
          await prisma.user.update({
            where: { id: socket.data.user.id },
            data: { online: false },
          });
          if (
            socket.data.user.roles.some(
              (role: { name: string }) => role.name === "ADMIN"
            )
          ) {
            io.sockets.emit("admin_available", await adminAvailibility());
          }
        });
        for (const channel of socket.data.user.ownerOnChannels) {
          socket.join("channel_" + channel.id);
        }
        for (const channel of socket.data.user.memberOnChannels) {
          socket.join("channel_" + channel.id);
        }
        for (const adminRequest of socket.data.user.adminRequests) {
          if (adminRequest.status === "accepted") {
            socket.join("admin_request_" + adminRequest.id);
          }
        }
        socket.join("directMessage_" + socket.data.user.id);
        socket.join("notifications_" + socket.data.user.id);
        if (
          socket.data.user.roles.some(
            (role: { name: string }) => role.name === "ADMIN"
          )
        ) {
          io.sockets.emit("admin_available", await adminAvailibility());
          for (const adminRequest of socket.data.user.approvedRequests) {
            if (adminRequest.status === "accepted") {
              socket.join("admin_request_" + adminRequest.id);
            }
          }
          socket.join("admin_notifications_in_tab");
          socket.join("admin_notifications");
        } else {
          socket.join("commercial_notifications");
        }
      }
    });

    // Attach user infos to socket
    io.use((socket, next) => {
      jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET as string,
        async (_: any, decoded: any) => {
          if (decoded) {
            const user = await prisma.user.findUnique({
              where: { id: decoded.id },
              include: {
                roles: true,
                bikes: true,
                ownerOnChannels: true,
                memberOnChannels: true,
                adminRequests: true,
                approvedRequests: true,
              },
            });
            socket.data.user = user ? exclude(user, "password") : null;
            return next();
          }
          socket.data.user = null;
          return next();
        }
      );
    });

    const adminAvailibility = async () => {
      const admins = await prisma.user.aggregate({
        where: {
          roles: {
            some: {
              name: "ADMIN",
            },
          },
          AND: {
            isAvailable: true,
            online: true,
          },
        },
        _count: {
          id: true,
        },
      });
      return admins._count.id > 0;
    };

    res.socket.server.io = io;
  }
  res.end();
};

export default socketHandler;
