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
      return await getAdminRequest(req, res);
    case "PATCH":
      return await updateAdminRequest(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getAdminRequest = withMiddleware("withAuth")(
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
        res.status(200).json(adminRequest);
      }

      res.status(400).json(adminRequest);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const updateAdminRequest = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    try {
      const { requestApproverId, status } = req.body;

      const adminRequest = await prisma.adminRequest.update({
        where: { id: String(req.query.adminRequestId) },
        data: {
          status,
          ...(requestApproverId && {
            requestApprover: {
              connect: { id: requestApproverId },
            },
          }),
          ...(requestApproverId === null && {
            requestApprover: {
              disconnect: true,
            },
          }),
        },
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

      if (adminRequest.status === "accepted") {
        // admin / user join adminRequest chat
        res.socket.server.io.sockets.sockets.forEach((socket) => {
          if (
            socket.data.user &&
            adminRequest.requestApprover &&
            (socket.data.user.id === adminRequest.user.id ||
              socket.data.user.id === adminRequest.requestApprover.id)
          ) {
            return socket.join("admin_request_" + adminRequest.id);
          }
        });
      } else if (adminRequest.status === "closed") {
        // admin / user leave adminRequest chat
        res.socket.server.io.sockets.sockets.forEach((socket) => {
          if (
            socket.data.user &&
            adminRequest.requestApprover &&
            (socket.data.user.id === adminRequest.user.id ||
              socket.data.user.id === adminRequest.requestApprover.id)
          ) {
            return socket.leave("admin_request_" + adminRequest.id);
          }
        });
      }
      res.socket.server.io
        .to("notifications_" + adminRequest.user.id)
        .emit("admin_request_status", "PATCH", adminRequest);
      res.socket.server.io
        .to("admin_notifications_in_tab")
        .emit("admin_notifications_in_tab", "PATCH", adminRequest);
      res.status(200).json(adminRequest);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
