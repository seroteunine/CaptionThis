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
// import { GameController } from './controller/gameController';
// import { GameRepository } from './repository/gameRepository';
import { RoomRepository } from './repository/roomRepository';
import { SessionRepository } from './repository/socketConnectionRepository';
const sessionRepository = new SessionRepository();
// const gameController = new GameController();
// const gameRepository = new GameRepository();
const roomRepository = new RoomRepository();

io.use((socket_before, next) => {
    const socket = socket_before as CustomSocket;
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        socket.sessionID = sessionID;
        sessionRepository.addMapping(socket.sessionID, socket.id);
        return next();
    }
    socket.sessionID = generateSessionID();
    sessionRepository.addMapping(socket.sessionID, socket.id);
    next();
});

io.on('connection', (socket_before) => {

    const socket = socket_before as CustomSocket;
    socket.emit("session", socket.sessionID);

    socket.on('host:create-room', () => {
        const roomID = generateRoomID();
        roomRepository.addRoom(roomID, socket.sessionID);
        const room = roomRepository.getRoom(roomID);
        if (room) {
            socket.emit('host:room-created', { room, roomID });
        } else {
            console.log('error with creating room');
        }
    })

    socket.on('player:join-room', (roomID) => {
        console.log(`player with id ${socket.sessionID} wants to join room: ${roomID}`);
        const room = roomRepository.getRoom(roomID);
        if (room) {
            room.addPlayer(socket.sessionID);
            socket.emit('player:room-joined', room);
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