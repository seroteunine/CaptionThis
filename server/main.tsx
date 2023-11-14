const express = require('express')
const app = express();
const http = require('http')
import { Server, Socket } from 'socket.io'

interface CustomSocket extends Socket {
    sessionID: string;
}

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://10.10.2.105:5173",
        methods: ["GET", "POST"]
    }
});

import { generateRoomID, generateSessionID } from './utils';
import { GameController } from './controller/gameController';
import { GameRepository } from './repository/gameRepository';
import { RoomRepository } from './repository/roomRepository';
import { SocketRepository } from './repository/socketConnectionRepository';
const gameController = new GameController();
const gameRepository = new GameRepository();
const roomRepository = new RoomRepository();
const socketRepository = new SocketRepository();

io.use((socket, next) => {
    const customSocket = socket as CustomSocket;
    const sessionID = customSocket.handshake.auth.sessionID;
    if (sessionID) {
        return next();
    }
    customSocket.sessionID = generateSessionID();
    next();
});

io.on('connection', (socket) => {

    const customSocket = socket as CustomSocket;

    socket.emit("session", {
        sessionID: customSocket.sessionID
    });

    socket.on('host:create-room', () => {
        const roomID = generateRoomID();
        const sessionID = customSocket.sessionID;
        roomRepository.addRoom(roomID, sessionID);
        const room = roomRepository.getRoom(roomID);
        if (room) {
            socket.emit('host:room-created', { roomID: roomID, sessionID: sessionID, isHost: true });
            console.log(`room created ${roomID} for hostID: ${sessionID}`);
        } else {
            console.log('error with creating room');
        }
    })

    socket.on('player:join-room', (roomID) => {
        const room = roomRepository.getRoom(roomID);
        const sessionID = customSocket.sessionID;
        if (room) {
            room.addPlayer(sessionID);
            socket.emit('player:room-joined', { roomID: roomID, sessionID: sessionID, isHost: false })
            console.log(`room joined ${roomID} for sessionID: ${sessionID}`);
            console.log(room);
        } else {
            socket.emit('player:invalid-room', roomID);
            console.log('error with joining room');
        }
    })

    // socket.on('send-image', ({ roomCode, image }) => {
    //     const room = roomManager.getRoom(roomCode);
    //     if (room) {
    //         const host = room.getHost();
    //         io.to(host).emit('send-image', image);
    //     }
    // })

    // socket.on('host:start-game', (roomID) => {
    //     const game = gameRepository.getGame(roomID);

    //     if (game) {
    //         socket.emit('error', 'room already has a game.');
    //     } else {
    //         const game = gameController.initGame();
    //         gameRepository.addGame(roomID, game);
    //         socket.emit('host:game-created');
    //     }
    // })

})

server.listen(5000, () => {
    console.log('listening');
});