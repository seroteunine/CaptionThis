import { io } from "socket.io-client";

const socket = io(":5000");
//Check master pushing / cd step

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
