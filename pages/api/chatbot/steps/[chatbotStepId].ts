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
      return await getStep(req, res);
    case "PATCH":
      return await updateStep(req, res);
    case "DELETE":
      return await deleteStep(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getStep = async (req: NextApiUserRequest, res: NextApiResponse) => {
  try {
    const step = await prisma.botStep.findUnique({
      where: { id: String(req.query.chatbotStepId) },
      include: {
        answers: true,
      },
    });

    if (step) {
      res.status(200).json(step);
    } else {
      res.status(404).json({ message: "Step not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateStep = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    const { question, isRoot, answers } = req.body;

    try {
      const step = await prisma.botStep.update({
        where: { id: String(req.query.chatbotStepId) },
        data: {
          question,
          isRoot,
          answers: {
            connect: answers,
          },
        },
        include: {
          answers: true,
        },
      });
      res.status(200).json(step);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deleteStep = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const step = await prisma.botStep.delete({
        where: { id: String(req.query.chatbotStepId) },
      });
      res.status(200).json(step);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
