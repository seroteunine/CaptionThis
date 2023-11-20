const express = require('express')
const app = express();
const http = require('http')

import { Server, Socket } from 'socket.io'
import { Room } from './domain/room';
import { generateRoomID, generatePlayerID } from './utils';

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});


interface CustomSocket extends Socket {
    playerID: string;
}

type GameDTO = {
    phase: string;
    playerNames: string[];
    photos: { [k: string]: ArrayBuffer };
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playersIDToName: { [k: string]: string };
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
    for (const playerID of players.keys()) {
        const playerSocketID = socketIDMap.get(playerID);
        io.to(playerSocketID || '').emit('player:room-update', roomDTO);
    }
}

function sendEveryoneRoomDTO(room: Room) {
    sendHostRoomDTO(room);
    sendPlayersRoomDTO(room);
}

function getRoomByPlayerID(playerID: string) {
    for (let room of roomMap.values()) {
        const players = room.getPlayers();
        if (players.has(playerID) || room.getHostID() === playerID) {
            return room;
        }
    }
}

function resendRoomIfExists(playerID: string) {
    const room = getRoomByPlayerID(playerID);
    if (room) {
        sendEveryoneRoomDTO(room);
    }
}


const socketIDMap = new Map<string, string>();
const roomMap = new Map<string, Room>();


io.use((socket_before, next) => {
    const socket = socket_before as CustomSocket;
    let playerID = socket.handshake.auth.playerID;
    if (!playerID) {
        playerID = generatePlayerID();
    }
    socket.playerID = playerID;
    socketIDMap.set(socket.playerID, socket.id);
    next();
});

io.on('connection', (socket_before) => {
    const socket = socket_before as CustomSocket;

    //For reconnected clients
    socket.emit("playerID", socket.playerID);
    resendRoomIfExists(socket.playerID);

    socket.on('host:create-room', () => {
        const roomID = generateRoomID();
        const hostID = socket.playerID;
        const room = new Room(roomID, hostID);
        roomMap.set(roomID, room);
        sendHostRoomDTO(room);
        console.log(`host ${hostID} created room ${roomID}`);
    })

    socket.on('player:join-room', (roomID) => {
        const playerID = socket.playerID;
        const room = roomMap.get(roomID);
        if (!room) {
            socket.emit('player:invalid-room');
            return;
        }
        room.addPlayer(playerID);
        sendEveryoneRoomDTO(room);
    })

    socket.on('host:start-game', (roomID) => {
        const room = roomMap.get(roomID);
        if (room) {
            room.tryStartGame();
            if (!room.hasGame()) {
                socket.emit('host:invalid-gamestart');
                return;
            }
            sendEveryoneRoomDTO(room);
        }
    })

    socket.on('host:next-phase', (roomID) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            room.game!.nextPhase();
            sendEveryoneRoomDTO(room);
        }
    })

    socket.on('player:send-image', (imageInputDTO) => {
        const room = getRoomByPlayerID(socket.playerID);
        if (room) {
            room.addPhoto(socket.playerID, imageInputDTO);
            sendEveryoneRoomDTO(room);
        }
    })

    socket.on('player:set-name', (newName) => {
        const room = getRoomByPlayerID(socket.playerID);
        if (room) {
            room.setPlayerName(socket.playerID, newName);
            sendEveryoneRoomDTO(room);
        }
    })

})

server.listen(5000, () => {
    console.log('listening');
});
