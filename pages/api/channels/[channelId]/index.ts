import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../lib/middlewares";
import { NextApiResponseServerIO, NextApiUserRequest } from "../../../../lib/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getChannel(req, res);
    case "PATCH":
      return await updateChannel(req, res);
    case "DELETE":
      return await deleteChannel(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getChannel = withMiddleware("inChannelOrAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const channel = await prisma.channel.findUnique({
        where: { id: String(req.query.channelId) },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              online: true,
            },
          },
          _count: {
            select: {
              members: true,
              messages: true,
            },
          },
        },
      });
      if (channel) {
        res.status(200).json(channel);
      } else {
        res.status(404).json({ message: "Channel not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const updateChannel = withMiddleware("inChannelOrAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    const { title, capacity, open } = req.body;

    try {
      const channel = await prisma.channel.update({
        where: { id: String(req.query.channelId) },
        data: {
          title,
          capacity: capacity > 0 ? capacity : undefined,
          open,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              online: true,
            },
          },
          _count: {
            select: {
              members: true,
              messages: true,
            },
          },
        },
      });
      if (channel) {
        res.socket.server.io.emit("channels", "PATCH", channel);
        res.status(200).json(channel);
      } else {
        res.status(404).json({ message: "Channel not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deleteChannel = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    try {
      const channel = await prisma.channel.delete({
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              online: true,
            },
          },
          _count: {
            select: {
              members: true,
              messages: true,
            },
          },
        },
        where: { id: String(req.query.channelId) },
      });
      res.socket.server.io.emit("channels", "DELETE", channel);
      res.status(200).json(channel);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
