import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../lib/middlewares";
import { exclude, PrismaClientSingleton } from "../../../lib/prismaUtils";
import { NextApiUserRequest } from "../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getContacts(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getContacts = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const users = (
        await prisma.user.findMany({
          where: {
            id: {
              not: req.user.id,
            },
            OR: [
              {
                receiverOnDirectMessages: {
                  some: {
                    authorId: req.user.id,
                  },
                },
              },
              {
                authorOnDirectMessages: {
                  some: {
                    receiverId: req.user.id,
                  },
                },
              },
            ],
          },
          include: {
            authorOnDirectMessages: {
              select: {
                id: true,
              },
              where: {
                receiverId: req.user.id,
                read: false,
              },
            },
          },
        })
      ).map((user) => exclude(user, "password"));
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
