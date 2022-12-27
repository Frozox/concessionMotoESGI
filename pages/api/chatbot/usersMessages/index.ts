import { Prisma } from "@prisma/client";
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
      return await getUserMessages(req, res);
    case "POST":
      return await addUserMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getUserMessages = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const userMessage = await prisma.botUserMessage.findMany({
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

const addUserMessage = withMiddleware("isAdmin")(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { message, stepId } = req.body;
    try {
      const userMessage = await prisma.botUserMessage.create({
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  }
);
