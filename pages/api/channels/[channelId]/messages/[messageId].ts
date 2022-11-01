import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware, {
  NextApiUserRequest,
} from "../../../../../lib/middlewares";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getMessage(req, res);
    case "PATCH":
      return await updateMessage(req, res);
    case "DELETE":
      return await deleteMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getMessage = withMiddleware("inChannelOrAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const message = await prisma.channelMessage.findUnique({
        where: { id: String(req.query.messageId) },
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
      if (message) {
        res.status(200).json(message);
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const updateMessage = withMiddleware("ifMessageAuthorOrAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    const { content } = req.body;

    try {
      const message = await prisma.channelMessage.update({
        where: { id: String(req.query.messageId) },
        data: {
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
        },
      });
      if (message) {
        res.status(200).json(message);
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deleteMessage = withMiddleware("ifMessageAuthorOrAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const message = await prisma.channelMessage.delete({
        where: { id: String(req.query.messageId) },
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
      if (message) {
        res.status(200).json(message);
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
