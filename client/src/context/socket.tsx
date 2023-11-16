import { ReactNode, createContext, useContext } from "react";
import { Socket, io } from "socket.io-client";

const SOCKET_URL = "http://10.10.2.105:5000";

const WebSocketContext = createContext<Socket | null>(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {

    const socket = io(SOCKET_URL);

    socket.onAny((eventName, ...args) => {
        console.log(eventName, args);
    });

    return (
        <WebSocketContext.Provider value={socket} >
            {children}
        </WebSocketContext.Provider>
    );

};