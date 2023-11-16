const express = require('express')
const app = express();
const http = require('http')

import { Server, Socket } from 'socket.io'
import { Room } from './domain/room';
import { generateRoomID, generateSessionID } from './utils';

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://10.10.2.105:5173",
        methods: ["GET", "POST"]
    }
});


interface CustomSocket extends Socket {
    sessionID: string;
}

type GameDTO = {
    phase: string;
    players: string[];
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playerIDs: string[],
    game: GameDTO | undefined
}

function sendHostRoomDTO(room: Room) {
    const roomDTO: RoomDTO = room.getRoomDTO();
    const hostID = room.getHostID();
    const hostSocketID = socketIDMap.get(hostID);
    io.to(hostSocketID || '').emit('host:room-update', roomDTO);
}

function sendPlayersRoomDTO(room: Room) {
    const roomDTO: RoomDTO = room.getRoomDTO();
    const players = room.getPlayers();
    players.forEach((player) => {
        const playerSocketID = socketIDMap.get(player);
        io.to(playerSocketID || '').emit('player:room-update', roomDTO);
    })
}

function sendEveryoneRoomDTO(room: Room) {
    sendHostRoomDTO(room);
    sendPlayersRoomDTO(room);
}

function resendRoomIfExists(sessionID: string) {
    for (let room of roomMap.values()) {
        const players = room.getPlayers();
        if (players.includes(sessionID) || room.getHostID() === sessionID) {
            sendEveryoneRoomDTO(room);
            return;
        }
    }
}

const socketIDMap = new Map<string, string>();
const roomMap = new Map<string, Room>();

io.use((socket_before, next) => {
    const socket = socket_before as CustomSocket;
    let sessionID = socket.handshake.auth.sessionID;
    if (!sessionID) {
        sessionID = generateSessionID();
    }
    socket.sessionID = sessionID;
    socketIDMap.set(socket.sessionID, socket.id);
    next();
});

io.on('connection', (socket_before) => {
    const socket = socket_before as CustomSocket;
    socket.emit("session", socket.sessionID);
    resendRoomIfExists(socket.sessionID);

    socket.on('host:create-room', () => {
        const roomID = generateRoomID();
        const hostID = socket.sessionID;
        const room = new Room(roomID, hostID);
        roomMap.set(roomID, room);
        sendHostRoomDTO(room);
        console.log(`host ${hostID} created room ${roomID}`);
    })

    socket.on('player:join-room', (roomID) => {
        const playerID = socket.sessionID;
        const room = roomMap.get(roomID);
        if (!room) {
            socket.emit('player:invalid-room');
            return;
        }
        room.addPlayer(playerID);
        sendEveryoneRoomDTO(room);
    })

    socket.on('host:start-game', (gameID) => {
        const room = roomMap.get(gameID);
        if (room) {
            room.tryStartGame();
            if (!room.hasGame()) {
                socket.emit('host:invalid-gamestart');
                return;
            }
            sendEveryoneRoomDTO(room);
        }
    })

})

server.listen(5000, () => {
    console.log('listening');
});