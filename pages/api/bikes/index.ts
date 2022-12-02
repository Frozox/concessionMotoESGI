import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../lib/middlewares";
import { PrismaClientSingleton } from "../../../lib/prismaUtils";
import { NextApiUserRequest } from "../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getBikes(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getBikes = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const bikes = await prisma.bike.findMany();
      res.status(200).json(bikes);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);