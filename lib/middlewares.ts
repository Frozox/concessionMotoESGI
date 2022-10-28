import { label, Middleware } from "next-api-middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

export type NextApiUserRequest = NextApiRequest & {
  user?: any;
};

export const withAuth: Middleware = async (req: NextApiUserRequest, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { email } = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

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

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const withRoles =
  (...roles: string[]): Middleware =>
  async (req: NextApiUserRequest, res, next) => {
    console.log("needRoles", roles);
    if (
      !roles.every((role) => req.user.roles.some((r: any) => r.name === role))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
  };

const withMiddleware = label({
  withAuth,
  isAdmin: [withAuth, withRoles("ADMIN")],
});

export default withMiddleware;