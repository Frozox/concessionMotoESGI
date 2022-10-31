import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * It takes a request and a response, and if the request method is POST, it calls the jwtAuth function,
 * which is defined below
 * @param {NextApiRequest} req - NextApiRequest - The request object
 * @param {NextApiResponse} res - NextApiResponse - The response object that will be sent back to the
 * client.
 * @returns the result of the jwtAuth function.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await jwtAuth(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

/**
 * It takes an email and password from the request body, checks if they exist, then checks if the user
 * exists and if the password matches the one in the database. If all of that is true, it creates a JWT
 * token and sends it back to the client
 * @param {NextApiRequest} req - NextApiRequest - The request object
 * @param {NextApiResponse} res - NextApiResponse
 * @returns A token
 */
const jwtAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json(error);
  }
};
