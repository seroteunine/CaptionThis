import { io } from "socket.io-client";

const socket = io(":5000");

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
