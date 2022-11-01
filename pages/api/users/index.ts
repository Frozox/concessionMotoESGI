import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withMiddleware, { NextApiUserRequest } from "../../../lib/middlewares";
import { exclude } from "../../../lib/prismaUtils";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getUsers(req, res);
    case "POST":
      return await addUser(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getUsers = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const users = (await prisma.user.findMany()).map((user) =>
        exclude(user, "password")
      );
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await prisma.user.create({
      include: {
        roles: true,
        bikes: true,
        ownerOnChannels: true,
        memberOnChannels: true,
      },
      data: {
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
        roles: {
          connect: {
            name: "USER",
          },
        },
      },
    });
    res.status(200).json(exclude(user, "password"));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};
