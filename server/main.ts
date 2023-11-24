const express = require('express')
const app = express();
const http = require('http')
import dotenv from 'dotenv';
dotenv.config();

import { Server, Socket } from 'socket.io'
import { Room } from './domain/room';
import { generateRoomID, generatePlayerID } from './utils';
import { Phase } from './domain/game';

console.log(process.env.MY_SERVICE_URL);
console.log('test');


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

type GameDTO = {
    phase: string;
    playerIDs: string[];
    photos: { [k: string]: ArrayBuffer };
    captions: Caption[];
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playerIDs: string[];
    game: GameDTO | undefined
}

type captionsForVotingDTO = {
    owner: string,
    captions: { authorPlayerID: string, captionText: string }[]
}


function sendHostRoomDTO(room: Room) {
    const roomDTO: RoomDTO = room.getRoomDTO();
    const hostID = room.getHostID();
    const hostSocketID = socketIDMap.get(hostID);
    io.to(hostSocketID || '').emit('host:room-update', roomDTO);
}

function sendHostCaptionsForVoting(room: Room, captionsForVoting: captionsForVotingDTO) {
    const hostID = room.getHostID();
    const hostSocketID = socketIDMap.get(hostID);
    io.to(hostSocketID || '').emit('host:captions-for-voting', captionsForVoting)
}

function sendPlayersRoomDTO(room: Room) {
    const roomDTO: RoomDTO = room.getRoomDTO();
    const players = room.getPlayers();
    for (const playerID of players.keys()) {
        const playerSocketID = socketIDMap.get(playerID);
        io.to(playerSocketID || '').emit('player:room-update', roomDTO);
    }
}

function sendPlayersCaptionsForVoting(room: Room, captionsForVoting: captionsForVotingDTO) {
    const players = room.getPlayers();
    for (const playerID of players.keys()) {
        const playerSocketID = socketIDMap.get(playerID);

        const captionsForVotingOwnExcluded = {
            owner: captionsForVoting.owner,
            captions: captionsForVoting.captions.filter(caption => caption.authorPlayerID !== playerID)
        };

        io.to(playerSocketID || '').emit('player:captions-for-voting', captionsForVotingOwnExcluded);
    }
}

function sendRoomNameUpdate(room: Room, playerID: string, username: string) {
    const host = room.getHostID();
    const hostSocketID = socketIDMap.get(host);
    io.to(hostSocketID || '').emit('host:name-update', { playerID: playerID, username: username });
}

function sendEveryoneRoomDTO(room: Room) {
    sendHostRoomDTO(room);
    sendPlayersRoomDTO(room);
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

function removeRoomAndSockets(roomID: string) {
    const room = roomMap.get(roomID);
    if (!room) {
        return;
    }
    const players = room.getPlayers();
    players.forEach((player) => socketIDMap.delete(player));
    const host = room.getHostID();
    socketIDMap.delete(host);
    roomMap.delete(roomID);
}


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
        console.log(`host ${hostID} created room ${roomID}`);
    })

    socket.on('player:join-room', (roomID) => {
        const room = roomMap.get(roomID);
        if (!room) {
            socket.emit('player:invalid-room');
            return;
        }
        room.addPlayer(socket.playerID);
        sendEveryoneRoomDTO(room);
        sendSessionInfo(socket.playerID, roomID);
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

    socket.on('player:send-image', ({ roomID, file }) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            game.addPhoto(socket.playerID, file);
            game.tryNextPhase();
            sendEveryoneRoomDTO(room);
        }
    })

    socket.on('player:set-name', ({ roomID, username }) => {
        const room = roomMap.get(roomID)
        if (room) {
            sendRoomNameUpdate(room, socket.playerID, username);
        }
    })

    socket.on('player:send-caption', ({ roomID, caption, ownerOfPhoto }) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            game.addCaption(socket.playerID, caption, ownerOfPhoto);
            game.tryNextPhase();
            sendHostRoomDTO(room);
            if (game.gamePhase === Phase.VOTING) {
                sendPlayersRoomDTO(room);
            }
        }
    })

    socket.on('host:request-first-photo', (roomID) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            const captionsForVoting = game.getCaptionsForVoting();
            sendHostCaptionsForVoting(room, captionsForVoting);
            sendPlayersCaptionsForVoting(room, captionsForVoting);
        }
    })

    socket.on('player:send-vote', ({ roomID, captionID }) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            game.addVote(socket.playerID, captionID);

            if (game.hasEveryoneVotedThisRound()) {
                game.nextVotingRound()

                game.tryNextPhase();
                if (game.gamePhase === Phase.END) {
                    sendEveryoneRoomDTO(room);
                }
                else {
                    const captionsForVotingDTO = game.getCaptionsForVoting();
                    sendHostCaptionsForVoting(room, captionsForVotingDTO);
                    sendPlayersCaptionsForVoting(room, captionsForVotingDTO);
                }
            }
        }
    })

    socket.on('host:get-score', (roomID) => {
        const room = roomMap.get(roomID);
        if (room && room.hasGame()) {
            const game = room.game!;
            const scoreDTO = game.getScore();
            socket.emit('host:score', scoreDTO);
        }
    })

    socket.on('host:delete-room', (roomID) => {
        removeRoomAndSockets(roomID);
    })

})

server.listen(5000, () => {
    console.log('listening');
});
