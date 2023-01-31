import {
    NextApiResponseServerIO,
    NextApiUserRequest,
} from "../../../lib/types";

export default async function handler(
    req: NextApiUserRequest,
    res: NextApiResponseServerIO
) {

    if (req.method === "POST") {
        const { message, type } = req.body;
        res.socket.server.io
            .to("users")
            .emit("notification", { message, type });
        res.status(201).json({ message: "Notification sent" });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }

}