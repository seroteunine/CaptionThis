const express = require('express')
const app = express();
const http = require('http')
import { Server } from 'socket.io'

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const { generateRoomID } = require('./utils/generateRoomID');
const RoomManager = require('./roomManager');
const roomManager = new RoomManager();

io.on('connection', (socket) => {
    console.log(`${socket.id} connected.`);

    socket.on('create-room', () => {
        const roomID = generateRoomID();
        roomManager.addRoom(roomID, socket.id);
    })

    socket.on('join-room', (roomID) => {
        const room = roomManager.getRoom(roomID);
        if (room) {
            console.log('found');
            room.addPlayer(socket.id);
        } else {
            console.log('room not found');
        }
    })

})

server.listen(5000, () => {
    console.log('listening');
});