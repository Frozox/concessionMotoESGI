import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../../lib/middlewares";
import { PrismaClientSingleton } from "../../../../../lib/prismaUtils";
import { NextApiResponseServerIO, NextApiUserRequest } from "../../../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getMessages(req, res);
    case "POST":
      return await addMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getMessages = withMiddleware("inChannelOrAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const { take, beforeCreatedAt } = req.query as {
        take?: string;
        beforeCreatedAt?: string;
      };

      const messages = await prisma.channelMessage.findMany({
        where: {
          channelId: String(req.query.channelId),
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
        },
        orderBy: {
          createdAt: "desc",
        },
        take: take ? Math.min(Math.max(Number(take), 0), 10) : 10,
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const addMessage = withMiddleware("inChannelOrAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    try {
      const message = await prisma.channelMessage.create({
        data: {
          content,
          authorId: req.user.id,
          channelId: String(req.query.channelId),
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      res.socket.server.io.to("channel_" + String(req.query.channelId)).emit("channelMessage", "POST", message);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
