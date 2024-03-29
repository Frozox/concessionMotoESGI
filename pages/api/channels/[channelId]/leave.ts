import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "../../../../lib/middlewares";
import { NextApiResponseServerIO, NextApiUserRequest } from "../../../../lib/types";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "PATCH":
            return await leaveChannel(req, res);
        default:
            return res.status(405).json({ message: "Method not allowed" });
    }
}

const leaveChannel = withMiddleware("inChannelOrAdmin")(
    async (req: NextApiUserRequest, res: NextApiResponseServerIO) => {

        try {
            const channel = await prisma.channel.update({
                where: { id: String(req.query.channelId) },
                data: {
                    members: {
                        disconnect: { id: req.user.id },
                    },
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            online: true,
                        },
                    },
                    members: {
                        select: {
                            id: true,
                        },
                    },
                    _count: {
                        select: {
                            members: true,
                            messages: true,
                        },
                    },
                },
            });
            if (channel) {
                res.socket.server.io.sockets.sockets.forEach((socket) => {
                    if(socket.data.user && socket.data.user.id === req.user.id) {
                        return socket.leave("channel_" + channel.id);
                    }
                })
                res.socket.server.io.emit("channels", "PATCH", channel);
                res.status(200).json(channel);
            } else {
                res.status(404).json({ message: "Channel not found" });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
);
