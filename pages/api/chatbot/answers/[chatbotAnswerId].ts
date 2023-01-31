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
    case "PATCH":
      return await updateAnswer(req, res);
    case "DELETE":
      return await deleteAnswer(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getAnswer = async (req: NextApiUserRequest, res: NextApiResponse) => {
  try {
    const answer = await prisma.botAnswer.findUnique({
      where: { id: String(req.query.chatbotAnswerId) },
      include: {
        step: true,
        nextStep: true,
      },
    });

    if (answer) {
      res.status(200).json(answer);
    } else {
      res.status(404).json({ message: "Answer not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateAnswer = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    const { answer, stepId, nextStepId } = req.body;

    try {
      const botAnswer = await prisma.botAnswer.update({
        where: { id: String(req.query.chatbotAnswerId) },
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
      res.status(500).json(error);
    }
  }
);

const deleteAnswer = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const answer = await prisma.botAnswer.delete({
        where: { id: String(req.query.chatbotAnswerId) },
      });
      res.status(200).json(answer);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
