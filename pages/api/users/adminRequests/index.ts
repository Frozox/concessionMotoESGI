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
    case "GET":
      return await getAdminRequests(req, res);
    case "POST":
      return await sendAdminRequest(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getAdminRequests = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponse) => {
    try {
      const adminRequests = await prisma.adminRequest.findMany({
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

const sendAdminRequest = withMiddleware("withAuth")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    if (req.user.roles.some((role: any) => role.name === "ADMIN")) {
      return res.status(400).json({
        message: "You can't send a request if you are already an admin",
      });
    }

    try {
      const pendingRequest = await prisma.adminRequest.findFirst({
        where: {
          userId: req.user.id,
          status: "pending",
        },
      });

      if (pendingRequest) {
        return res.status(400).json({
          message: "You already have a pending request",
        });
      }

      const adminRequest = await prisma.adminRequest.create({
        data: {
          userId: req.user.id,
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

      res.socket.server.io
        .to("notifications_" + req.user.id)
        .emit("admin_request_status", "POST", adminRequest);
      res.socket.server.io
        .to("notifications_" + req.user.id)
        .emit("notifications", "POST", { type: "alert-success", message: `Votre demande à bien été envoyé` });
      res.socket.server.io
        .to("admin_notifications")
        .emit("admin_notifications", "POST", { type: "alert-info", message: `Une demande d'assitance de la part de ${adminRequest.user.firstName} à été reçu` });
      res.socket.server.io
        .to("admin_notifications_in_tab")
        .emit("admin_notifications_in_tab", "POST", adminRequest);
      res.status(200).json(adminRequest);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
