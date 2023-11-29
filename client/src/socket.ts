import { io } from "socket.io-client";

const playerID = sessionStorage.getItem("playerID");
const roomID = sessionStorage.getItem("roomID");

const socket = io(":5000", {
    auth: {
      playerID,
      roomID
    }
});

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
