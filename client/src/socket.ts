import { io } from "socket.io-client";

const URL = window.location.href + ":5000";
const socket = io(URL);

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
