import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import withMiddleware from "../../../../lib/middlewares";
import { exclude } from "../../../../lib/prismaUtils";
import { NextApiUserRequest } from "../../../../lib/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getUser(req, res);
    case "PATCH":
      return await updateUser(req, res);
    case "DELETE":
      return await deleteUser(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getUser = withMiddleware("withMeInQuery")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: String(req.query.userId) },
        include: {
          roles: true,
          bikes: true,
          ownerOnChannels: true,
          memberOnChannels: true,
        },
      });
      if (user) {
        res.status(200).json(exclude(user, "password"));
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const updateUser = withMiddleware("withMeInQuery")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    if (
      req.user.id !== String(req.query.userId) &&
      !req.user.roles.includes("ADMIN")
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { email, firstName, lastName, password, bikes, memberOnChannels } =
      req.body;

    try {
      const user = await prisma.user.update({
        where: { id: String(req.query.userId) },
        include: {
          roles: true,
          bikes: true,
          ownerOnChannels: true,
          memberOnChannels: true,
        },
        data: {
          email,
          firstName,
          lastName,
          password: password ? await bcrypt.hash(password, 10) : undefined,
          bikes: {
            connect: bikes,
          },
          memberOnChannels: {
            connect: memberOnChannels,
          },
        },
      });
      res.status(200).json(exclude(user, "password"));
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const deleteUser = withMiddleware("withMeInQuery")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    if (
      req.user.id !== String(req.query.userId) &&
      !req.user.roles.includes("ADMIN")
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const user = await prisma.user.delete({
        include: {
          roles: true,
          bikes: true,
          ownerOnChannels: true,
          memberOnChannels: true,
        },
        where: { id: String(req.query.userId) },
      });
      res.status(200).json(exclude(user, "password"));
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
