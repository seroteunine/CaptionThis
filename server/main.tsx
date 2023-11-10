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
        const roomCode = generateRoomID();
        roomManager.addRoom(roomCode, socket.id);
        socket.emit('valid-room', { roomCode: roomCode, isHost: true });
        console.log(roomCode);
    })

    socket.on('join-room', (roomCode) => {
        const room = roomManager.getRoom(roomCode);
        if (room) {
            room.addPlayer(socket.id);
            socket.emit('valid-room', { roomCode: roomCode, isHost: false })
        } else {
            socket.emit('invalid-room', roomCode);
        }
    })

    socket.on('send-message', ({ roomCode, textMessage }) => {
        console.log(roomCode, textMessage);

        const host = roomManager.getRoom(roomCode).getHost();
        io.to(host).emit('send-message', textMessage);
    })

    socket.on('send-image', ({ roomCode, image }) => {
        const host = roomManager.getRoom(roomCode).getHost();
        io.to(host).emit('send-image', image);
        console.log(image);

    })

})

server.listen(5000, () => {
    console.log('listening');
});