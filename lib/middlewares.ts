import { label, Middleware } from "next-api-middleware";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

export type NextApiUserRequest = NextApiRequest & {
  user?: any;
};

export const withAuth: Middleware = async (
  req: NextApiUserRequest,
  res,
  next
) => {
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
        roles: true,
        bikes: true,
        ownerOnChannels: true,
        memberOnChannels: true,
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
    if (
      !roles.every((role) => req.user.roles.some((r: any) => r.name === role))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return next();
  };

export const withMeInQuery: Middleware = async (
  req: NextApiUserRequest,
  res,
  next
) => {
  if (req.query.userId === "me") {
    req.query.userId = req.user.id;
  }
  next();
};

export const inChannelOrAdmin: Middleware = async (
  req: NextApiUserRequest,
  res,
  next
) => {
  if (
    req.user.memberOnChannels.some((c: any) => c.id === req.query.channelId) ||
    req.user.roles.some((r: any) => r.name === "ADMIN")
  ) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export const ifMessageAuthorOrAdmin: Middleware = async (
  req: NextApiUserRequest,
  res,
  next
) => {
  const message = await prisma.channelMessage.findUnique({
    where: {
      id: String(req.query.messageId),
    },
  });

  if (
    message?.authorId === req.user.id ||
    req.user.roles.some((r: any) => r.name === "ADMIN")
  ) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

const withMiddleware = label({
  withAuth,
  withMeInQuery: [withAuth, withMeInQuery],
  inChannelOrAdmin: [withAuth, inChannelOrAdmin],
  ifMessageAuthorOrAdmin: [withAuth, ifMessageAuthorOrAdmin],
  isAdmin: [withAuth, withRoles("ADMIN")],
});

export default withMiddleware;
