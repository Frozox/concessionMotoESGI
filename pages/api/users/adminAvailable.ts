import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../lib/middlewares";
import { PrismaClientSingleton } from "../../../lib/prismaUtils";
import {
  NextApiResponseServerIO,
  NextApiUserRequest,
} from "../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PATCH":
      return await toogleAvailability(req, res);
    case "POST":
      return await adminAvailable(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const toogleAvailability = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    try {
      const admin = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          isAvailable: !req.user.isAvailable,
        },
      });
      const adminsAvailable = await prisma.user.aggregate({
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
      res.socket.server.io.sockets.emit(
        "admin_available",
        adminsAvailable._count.id > 0
      );
      res.status(200).json(admin.isAvailable);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const adminAvailable = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    try {
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
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
