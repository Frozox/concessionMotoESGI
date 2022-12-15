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
      return await getSteps(req, res);
    case "POST":
      return await addStep(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getSteps = async (req: NextApiUserRequest, res: NextApiResponse) => {
  try {
    const step = await prisma.botStep.findMany({
      include: {
        answers: true,
      },
    });
    res.status(200).json(step);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addStep = withMiddleware("isAdmin")(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { question, isRoot } = req.body;
    try {
      const step = await prisma.botStep.create({
        data: {
          question,
          isRoot: isRoot || false,
        },
        include: {
          answers: true,
        },
      });
      res.status(200).json(step);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  }
);
