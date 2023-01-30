import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../../lib/middlewares";
import { PrismaClientSingleton } from "../../../../../lib/prismaUtils";
import {
  NextApiResponseServerIO,
  NextApiUserRequest,
} from "../../../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getMessages(req, res);
    case "POST":
      return await addMessage(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getMessages = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const adminRequest = await prisma.adminRequest.findUnique({
        where: { id: String(req.query.adminRequestId) },
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
      });
      if (
        adminRequest &&
        (req.user.id === adminRequest.user.id ||
          (adminRequest.requestApprover &&
            req.user.id === adminRequest.requestApprover.id))
      ) {
        const adminRequestMessages = await prisma.adminRequestMessage.findMany({
          where: { requestId: String(req.query.adminRequestId) },
          select: {
            id: true,
            requestId: true,
            content: true,
            createdAt: true,
            author: {
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
        res.status(200).json(adminRequestMessages);
      }
      res.status(403).end();
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const addMessage = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    const { content } = req.body;
    try {
      const adminRequest = await prisma.adminRequest.findUnique({
        where: { id: String(req.query.adminRequestId) },
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
      });
      if (
        adminRequest &&
        adminRequest.status === "accepted" &&
        (req.user.id === adminRequest.user.id ||
          (adminRequest.requestApprover &&
            req.user.id === adminRequest.requestApprover.id))
      ) {
        const adminRequestMessage = await prisma.adminRequestMessage.create({
          data: {
            requestId: String(req.query.adminRequestId),
            content,
            authorId: req.user.id,
          },
          select: {
            id: true,
            requestId: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
        res.socket.server.io
          .to("admin_request_" + adminRequest.id)
          .emit("admin_request_messages", "POST", adminRequestMessage);
        res.status(200).json(adminRequestMessage);
      }
      res.status(403).end();
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
