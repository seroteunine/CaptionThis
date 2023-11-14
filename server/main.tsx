const express = require('express')
const app = express();
const http = require('http')
import { Server } from 'socket.io'

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://10.10.2.105:5173",
        methods: ["GET", "POST"]
    }
});

import { generateRoomID, generateUserID } from './utils';
import { GameController } from './controller/gameController';
import { GameRepository } from './repository/gameRepository';
import { RoomRepository } from './repository/roomRepository';
const gameController = new GameController();
const gameRepository = new GameRepository();
const roomRepository = new RoomRepository();

io.on('connection', (socket) => {
    console.log(`${socket.id} connected.`);

    socket.on('host:create-room', () => {
        const roomID = generateRoomID();
        const userID = generateUserID();
        roomRepository.addRoom(roomID, userID);
        const room = roomRepository.getRoom(roomID);
        if (room) {
            socket.emit('host:room-created', { roomID: roomID, userID: userID, isHost: true });
            console.log(`room created ${roomID} for hostID: ${userID}`);
        } else {
            console.log('error with creating room');
        }
    })

    socket.on('player:join-room', (roomID) => {
        const room = roomRepository.getRoom(roomID);
        if (room) {
            const userID = generateUserID();
            room.addPlayer(userID);
            socket.emit('player:room-joined', { roomID: roomID, userID: userID, isHost: false })
            console.log(`room joined ${roomID} for userID: ${userID}`);
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