import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../lib/middlewares";
import {
  NextApiResponseServerIO,
  NextApiUserRequest,
} from "../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await sendCommercialNotification(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const sendCommercialNotification = withMiddleware("isAdmin")(
  async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {
    try {
      const { message, type } = req.body;

      if (!message || !type) return res.status(400).end();

      res.socket.server.io
        .to("commercial_notifications")
        .emit("commercial_notifications", "POST", { type, message });

      res.status(204).end();
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
