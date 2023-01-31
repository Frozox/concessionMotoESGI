import { Socket } from "socket.io";
import { io } from "socket.io-client"
import { AuthSocket } from "../../../lib/types"

const SOCKET_URL = process.env.SOCKET_URL || ''

export const initSocket = (token: string | null): AuthSocket<Socket> => {
    return io(SOCKET_URL, { path: '/api/socket.io', auth: { token } }) as AuthSocket<Socket>;
}