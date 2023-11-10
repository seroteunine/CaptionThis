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

import { generateRoomID } from './utils';
const RoomManager = require('./roomManager');
const roomManager = new RoomManager();

io.on('connection', (socket) => {
    console.log(`${socket.id} connected.`);

    socket.on('create-room', () => {
        const roomID = generateRoomID();
        roomManager.addRoom(roomID, socket.id);
        socket.emit('valid-room', roomID);
        console.log(roomID);
    })

    socket.on('join-room', (roomID) => {
        const room = roomManager.getRoom(roomID);
        if (room) {
            room.addPlayer(socket.id);
            socket.emit('valid-room', roomID)
        } else {
            socket.emit('invalid-room', roomID);
        }
    })

})

server.listen(5000, () => {
    console.log('listening');
});