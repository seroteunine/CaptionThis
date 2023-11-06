import { createContext } from "react";
import { Socket, io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"
export const socket = io(SOCKET_URL)

type ContextType = {
    socket: Socket | undefined
}

export const SocketContext = createContext<ContextType>({
    socket
});
