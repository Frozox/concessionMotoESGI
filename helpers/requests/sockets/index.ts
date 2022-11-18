import { io } from "socket.io-client"

const SOCKET_URL = process.env.SOCKET_URL || ''

export const initSocket = (token: string | null) => {
    return io(SOCKET_URL, { path: '/api/socket.io', auth: { token } });
}