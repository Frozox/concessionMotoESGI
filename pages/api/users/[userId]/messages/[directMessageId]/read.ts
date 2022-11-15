import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../../../lib/middlewares";
import { NextApiUserRequest } from "../../../../../../lib/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await readDirectMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const readDirectMessage = withMiddleware("ifDirectMessageAuthorOrReciver")(
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
      if (directMessage?.receiverId === req.user.id && !directMessage?.read) {
        const updatedDirectMessage = await prisma.directMessage.update({
          where: {
            id: String(req.query.directMessageId),
          },
          data: {
            read: true,
          },
        });
        res.status(200).json(updatedDirectMessage);
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
