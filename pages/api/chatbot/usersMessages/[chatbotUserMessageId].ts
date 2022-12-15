import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../lib/middlewares";
import { PrismaClientSingleton } from "../../../../lib/prismaUtils";
import { NextApiUserRequest } from "../../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getUserMessage(req, res);
    case "PATCH":
      return await updateUserMessage(req, res);
    case "DELETE":
      return await deleteUserMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getUserMessage = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const userMessage = await prisma.botUserMessage.findUnique({
        where: { id: String(req.query.chatbotUserMessageId) },
        include: {
          step: true,
        },
      });

      if (userMessage) {
        res.status(200).json(userMessage);
      } else {
        res.status(404).json({ message: "UserMessage not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const updateUserMessage = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    const { message, stepId } = req.body;

    try {
      const userMessage = await prisma.botUserMessage.update({
        where: { id: String(req.query.chatbotUserMessageId) },
        data: {
          message,
          stepId,
        },
        include: {
          step: true,
        },
      });
      res.status(200).json(userMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deleteUserMessage = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const userMessage = await prisma.botUserMessage.delete({
        where: { id: String(req.query.chatbotUserMessageId) },
      });
      res.status(200).json(userMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
