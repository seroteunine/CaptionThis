const express = require('express')
const app = express();
const http = require('http')
import dotenv from 'dotenv';
dotenv.config();

import { Server, Socket } from 'socket.io'
import { Room } from './domain/room';
import { generateRoomID, generatePlayerID } from './utils';

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
}

type Caption = {
    ID: number;
    authorPlayerID: string;
    photoOwnerPlayerID: string;
    captionText: string;
    votedBy: string[];
}

type GameDTO = {
    phase: string;
    playerNames: string[];
    photos: { [k: string]: ArrayBuffer };
    captions: Caption[];
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playersIDToName: { [k: string]: string };
    game: GameDTO | undefined
}

type CaptionInputDTO = {
    caption: string,
    ownerOfPhoto: string
}

type CaptionedPhotoDTO = {
    owner: string,
    captions: { authorPlayerID: string, captionText: string }[]
}


function sendHostRoomDTO(room: Room) {
    const roomDTO: RoomDTO = room.getRoomDTO();
    const hostID = room.getHostID();
    const hostSocketID = socketIDMap.get(hostID);
    io.to(hostSocketID || '').emit('host:room-update', roomDTO);
}

function sendHostCaptionedPhoto(hostID: string, captionedPhoto: CaptionedPhotoDTO) {
    const hostSocketID = socketIDMap.get(hostID);
    io.to(hostSocketID || '').emit('host:captioned-photo', captionedPhoto)
}

function sendPlayersRoomDTO(room: Room) {
    const roomDTO: RoomDTO = room.getRoomDTO();
    const players = room.getPlayers();
    for (const playerID of players.keys()) {
        const playerSocketID = socketIDMap.get(playerID);
        io.to(playerSocketID || '').emit('player:room-update', roomDTO);
    }
}

function sendPlayersCaptionedPhoto(room: Room, captionedPhoto: CaptionedPhotoDTO) {
    const players = room.getPlayers();
    for (const playerID of players.keys()) {
        const playerSocketID = socketIDMap.get(playerID);

        const captionedPhotoOwnExcluded = {
            owner: captionedPhoto.owner,
            captions: captionedPhoto.captions.filter(caption => caption.authorPlayerID !== players.get(playerID))
        }; //To make sure that you cant vote on yourself

        io.to(playerSocketID || '').emit('player:captioned-photo', captionedPhotoOwnExcluded);
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
        const playerSocketID = socketIDMap.get(playerID);
        const roomDTO: RoomDTO = room.getRoomDTO();
        io.to(playerSocketID || '').emit('player:room-update', roomDTO);
    }
}

function removeConnectionIfDead(playerID: string) {
    const socketID = socketIDMap.get(playerID);
    // TODO: ping the user and remove the playerID if this user doesnt send a pong in 5 seconds.
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

    socket.on('player:send-caption', (captionInput: CaptionInputDTO) => {
        const room = getRoomByPlayerID(socket.playerID);
        if (room && room.hasGame() && room.playersIDToName.get(socket.playerID)) {
            const game = room.game!;
            const authorPlayername = room.playersIDToName.get(socket.playerID)!;
            game.addCaption(authorPlayername, captionInput.caption, captionInput.ownerOfPhoto);
            sendHostRoomDTO(room);
        }
    })

    socket.on('host:request-next-photo', (currentIndex: number) => {
        const room = getRoomByPlayerID(socket.playerID);
        if (room && room.hasGame()) {
            const game = room.game!;
            const captionedPhoto = game.getCaptionedPhoto(currentIndex);
            sendHostCaptionedPhoto(socket.playerID, captionedPhoto);
            sendPlayersCaptionedPhoto(room, captionedPhoto);
        }
    })

    socket.on('player:send-vote', (captionID) => {
        console.log(socket.playerID, captionID);
        const room = getRoomByPlayerID(socket.playerID);
        if (room && room.hasGame()) {
            const game = room.game!;
            game.addVote(socket.playerID, captionID);
            sendEveryoneRoomDTO(room);
        }
    })

    socket.on('disconnect', () => {
        removeConnectionIfDead(socket.playerID);
    })

})

server.listen(5000, () => {
    console.log('listening');
});
