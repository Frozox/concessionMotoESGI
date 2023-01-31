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
      return await getAnswer(req, res);
    case "POST":
      return await addAnswer(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getAnswer = async (req: NextApiUserRequest, res: NextApiResponse) => {
  try {
    const answer = await prisma.botAnswer.findMany({
      include: {
        step: true,
        nextStep: true,
      },
    });
    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addAnswer = withMiddleware("isAdmin")(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { answer, stepId, nextStepId } = req.body;
    try {
      const botAnswer = await prisma.botAnswer.create({
        data: {
          answer,
          stepId,
          nextStepId,
        },
        include: {
          step: true,
          nextStep: true,
        },
      });
      res.status(200).json(botAnswer);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  }
);
