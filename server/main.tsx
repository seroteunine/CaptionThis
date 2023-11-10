const express = require('express')
const app = express();
const http = require('http')
import { Server } from 'socket.io'

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://10.10.2.105:5173",
        methods: ["GET", "POST"]
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
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

    socket.on('send-image', ({ roomCode, image }) => {
        const room = roomManager.getRoom(roomCode);
        if (room) {
            const host = room.getHost();
            io.to(host).emit('send-image', image);
        }
    })

})

server.listen(5000, () => {
    console.log('listening');
});