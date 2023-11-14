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
const gameController = new GameController();
const gameRepository = new GameRepository();
const roomRepository = new RoomRepository();

io.use((socket_before, next) => {
    const socket = socket_before as CustomSocket;
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        socket.sessionID = sessionID;
        return next();
    }
    socket.sessionID = generateSessionID();
    next();
});

io.on('connection', (socket_before) => {

    const socket = socket_before as CustomSocket;
    socket.emit("session", socket.sessionID);

    socket.on('host:create-room', () => {
        console.log('host creates room with socket id', socket.sessionID);
        // roomRepository.addRoom(roomID, sessionID);
        // const room = roomRepository.getRoom(roomID);
        // if (room) {
        //     console.log(`room created`);
        // } else {
        //     console.log('error with creating room');
        // }
    })

    // socket.on('player:join-room', (roomID) => {
    //     const room = roomRepository.getRoom(roomID);
    //     const sessionID = customSocket.sessionID;
    //     if (room) {
    //         room.addPlayer(sessionID);
    //         socket.emit('player:room-joined', { roomID: roomID, sessionID: sessionID, isHost: false })
    //         console.log(`room joined ${roomID} for sessionID: ${sessionID}`);
    //         console.log(room);
    //     } else {
    //         socket.emit('player:invalid-room', roomID);
    //         console.log('error with joining room');
    //     }
    // })

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