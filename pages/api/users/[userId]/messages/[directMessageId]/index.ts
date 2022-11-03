import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware, {
  NextApiUserRequest,
} from "../../../../../../lib/middlewares";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getDirectMessage(req, res);
    case "DELETE":
      return await deleteDirectMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getDirectMessage = withMiddleware("ifDirectMessageAuthorOrReciver")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    if (req.user.id === String(req.query.userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const directMessage = await prisma.directMessage.findUnique({
        where: {
          id: String(req.query.directMessageId),
        },
      });
      res.status(200).json(directMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deleteDirectMessage = withMiddleware("ifDirectMessageAuthorOrReciver")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    if (req.user.id === String(req.query.userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const directMessage = await prisma.directMessage.findUnique({
        where: {
          id: String(req.query.directMessageId),
        },
      });
      if (directMessage?.authorId === req.user.id) {
        await prisma.directMessage.delete({
          where: {
            id: String(req.query.directMessageId),
          },
        });
        res.status(200).json(directMessage);
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
