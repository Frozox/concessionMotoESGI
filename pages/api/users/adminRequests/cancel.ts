import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../lib/middlewares";
import { PrismaClientSingleton } from "../../../../lib/prismaUtils";
import {
  NextApiResponseServerIO,
  NextApiUserRequest,
} from "../../../../lib/types";

const prisma = PrismaClientSingleton.getInstance().prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await cancelAdminRequest(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const cancelAdminRequest = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    try {
      const adminRequest = await prisma.adminRequest.findFirst({
        where: { userId: req.user.id, status: "pending" },
      });

      if (!adminRequest) {
        return res.status(404).json({ message: "No pending request found" });
      }

      const canceledAdminRequest = await prisma.adminRequest.update({
        where: { id: adminRequest.id },
        data: { status: "cancelled" },
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

      res.socket.server.io
        .to("notifications_" + req.user.id)
        .emit("admin_request_status", "PATCH", canceledAdminRequest);
      res.socket.server.io
        .to("admin_notifications_in_tab")
        .emit("admin_notifications_in_tab", "PATCH", canceledAdminRequest);
      res.status(200).json(canceledAdminRequest);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
