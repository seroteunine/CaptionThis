const express = require('express')
const app = express();
const http = require('http')
import dotenv from 'dotenv';
dotenv.config();

import { Server, Socket } from 'socket.io'
import { Room } from './domain/room';
import { generateRoomID, generatePlayerID } from './utils';
import { Phase } from './domain/game';

//Setup Http & socket.io server
const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: process.env.MY_SERVICE_URL,
        methods: ["GET", "POST"]
    }
});


interface CustomSocket extends Socket {
    playerID: string;
    roomID: string;
}

type Caption = {
    ID: number;
    authorPlayerID: string;
    photoOwnerPlayerID: string;
    captionText: string;
}

type Vote = {
    playerID: string;
    captionID: number;
}

type GameDTO = {
    phase: string;
    playerIDs: string[];
    photos: { [k: string]: ArrayBuffer };
    captions: Caption[];
    votes: { [k: string]: Vote[] };
    votingRound: number;
    score: { [k: string]: number };
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playerIDs: string[];
    game: GameDTO | undefined
}


//Mongo DB for logging
import connectToDB from './database/setup';
const LOGGING_COLLECTION_NAME = 'gameLogging';

async function logRoomEnd(roomID: string) {
    const room = roomMap.get(roomID);
    if (room) {
        const gameData = {
            roomID: roomID,
            duration_s: (Date.now() - room.datetime_created) / 1000,
            amount_of_players: room.game?.playerIDs.size
        }
        const db = await connectToDB();
        const collection = db.collection(LOGGING_COLLECTION_NAME);
        await collection.insertOne(gameData);
    }
}

//Helper functions for communicating with clients
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

function sendRoomNameUpdate(room: Room, playerID: string, username: string) {
    const host = room.getHostID();
    const hostSocketID = socketIDMap.get(host);
    io.to(hostSocketID || '').emit('host:name-update', { playerID: playerID, username: username });
}

function sendSessionInfo(playerID: string, roomID: string) {
    const socketID = socketIDMap.get(playerID);
    io.to(socketID || '').emit("session", { playerID, roomID });
}

function resendRoomIfExists(socket: CustomSocket) {
    const room = roomMap.get(socket.roomID);
    if (room) {
        const socketID = socketIDMap.get(socket.playerID);
        const roomDTO: RoomDTO = room.getRoomDTO();
        io.to(socketID || '').emit('player:room-update', roomDTO);
    }
}

//Remove rooms and sockets that have been inactive 
// (otherwise the roommap and socketIDmap will get crowded and increase collision)
function removeRoomAndSockets(roomID: string) {
    const room = roomMap.get(roomID);
    if (room) {
        const players = room.getPlayers();
        players.forEach((player) => {
            notifyRemoving(socketIDMap.get(player) || '');
            socketIDMap.delete(player)
        });
        const host = room.getHostID();
        notifyRemoving(socketIDMap.get(host) || '');
        socketIDMap.delete(host);
        roomMap.delete(roomID);
    }
}

function notifyRemoving(socketID: string) {
    io.to(socketID).emit('alert:removed');
}

function removeExpiredRooms() {
    const datetime_oneHourAgo = Date.now() - 3600000;
    for (const [roomID, room] of roomMap) {
        if (room.datetime_created < datetime_oneHourAgo) {
            removeRoomAndSockets(roomID);
        }
    }
}
setInterval(removeExpiredRooms, 600000); //Checks every 10 minutes

//Mapping the roomIDs to Room objects and PlayerIDs to socketIDs
const socketIDMap = new Map<string, string>();
const roomMap = new Map<string, Room>();

io.use((socket_before, next) => {
    const socket = socket_before as CustomSocket;
    let playerID = socket.handshake.auth.playerID;
    let roomID = socket.handshake.auth.roomID;
    if (!playerID) {
        playerID = generatePlayerID();
    }
    socket.playerID = playerID;
    socket.roomID = roomID;
    socketIDMap.set(socket.playerID, socket.id);
    next();
});

io.on('connection', (socket_before) => {
    const socket = socket_before as CustomSocket;

    //For reconnecting clients
    sendSessionInfo(socket.playerID, socket.roomID);
    resendRoomIfExists(socket);

    socket.on('host:create-room', () => {
        const roomID = generateRoomID();
        const hostID = socket.playerID;
        const room = new Room(roomID, hostID);
        roomMap.set(roomID, room);
        sendHostRoomDTO(room);
        sendSessionInfo(socket.playerID, roomID);
    });

    socket.on('player:join-room', (roomID) => {
        const room = roomMap.get(roomID);
        if (!room) {
            socket.emit('player:invalid-room');
            return;
        }
        room.addPlayer(socket.playerID);
        sendEveryoneRoomDTO(room);
        sendSessionInfo(socket.playerID, roomID);
    });

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
    });

    socket.on('host:remove-player', ({ roomID, playerID }) => {
        const room = roomMap.get(roomID);
        if (room) {
            console.log(`want to remove ${playerID} in room: ${roomID}`);
            room.removePlayer(playerID);
            if (room.hasGame()) {
                const game = room.game!;
                game.tryNextPhase();
            }
            sendEveryoneRoomDTO(room);
            notifyRemoving(socketIDMap.get(playerID) || '');
        }
    });

    socket.on('player:send-image', ({ roomID, file }) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            game.addPhoto(socket.playerID, file);
            socket.emit('player:photo-received');
            game.tryNextPhase();
            sendEveryoneRoomDTO(room);
        }
    });

    socket.on('player:set-name', ({ roomID, username }) => {
        const room = roomMap.get(roomID)
        if (room) {
            sendRoomNameUpdate(room, socket.playerID, username);
        }
    });

    socket.on('player:send-caption', ({ roomID, caption, ownerOfPhoto }) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            game.addCaption(socket.playerID, caption, ownerOfPhoto);
            game.tryNextPhase();
            sendEveryoneRoomDTO(room);
        }
    });

    socket.on('player:send-vote', ({ roomID, captionID }) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            game.addVote(socket.playerID, captionID);

            game.tryNextPhase();

            if (game.gamePhase === Phase.END) {
                logRoomEnd(roomID);
            }
            sendEveryoneRoomDTO(room);
        }
    });

    socket.on('host:another-round', (roomID) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame() && room.game!.gamePhase === Phase.END) {
            room.createNextGame();
            sendEveryoneRoomDTO(room);
        }
    });

})

server.listen(5000, () => {
    console.log('listening');
});
