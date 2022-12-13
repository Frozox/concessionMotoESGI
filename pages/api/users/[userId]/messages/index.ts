import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../../lib/middlewares";
import { PrismaClientSingleton } from "../../../../../lib/prismaUtils";
import {
  NextApiResponseServerIO,
  NextApiUserRequest,
} from "../../../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getDirectMessages(req, res);
    case "POST":
      return await sendDirectMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getDirectMessages = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    if (req.user.id === String(req.query.userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const { take, beforeCreatedAt } = req.query as {
        take?: string;
        beforeCreatedAt?: string;
      };

      const directMessages = await prisma.directMessage.findMany({
        where: {
          OR: [
            {
              authorId: req.user.id,
              receiverId: String(req.query.userId),
            },
            {
              authorId: String(req.query.userId),
              receiverId: req.user.id,
            },
          ],
          createdAt: {
            lt: beforeCreatedAt ? new Date(beforeCreatedAt) : undefined,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: take ? Math.min(Math.max(Number(take), 0), 10) : 10,
      });
      res.status(200).json(directMessages);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const sendDirectMessage = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    if (req.user.id === String(req.query.userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    try {
      const directMessage = await prisma.directMessage.create({
        data: {
          authorId: req.user.id,
          receiverId: String(req.query.userId),
          content,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      res.socket.server.io.to('directMessage_' + req.user.id).emit("directMessage", "POST", directMessage);
      res.socket.server.io.to('directMessage_' + String(req.query.userId)).emit("directMessage", "POST", directMessage);

      res.status(200).json(directMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
