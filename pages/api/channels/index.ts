import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../lib/middlewares";
import { NextApiResponseServerIO, NextApiUserRequest } from "../../../lib/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getChannels(req, res);
    case "POST":
      return await addChannel(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getChannels = async (req: NextApiUserRequest, res: NextApiResponse) => {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addChannel = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    const { title, capacity, open } = req.body;

    try {
      const channel = await prisma.channel.create({
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
        data: {
          ownerId: req.user.id,
          title,
          capacity,
          open: open || false,
        },
      });
      res.socket.server.io.emit("channels", "POST", channel);
      res.status(200).json(channel);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  }
);
