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
      return await getMyAdminRequests(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getMyAdminRequests = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const adminRequests = await prisma.adminRequest.findMany({
        where: { userId: req.user.id },
        select: {
          id: true,
          status: true,
          createdAt: true,
          requestApprover: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.status(200).json(adminRequests);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
