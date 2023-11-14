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


import { generateGameID, generateSessionID } from './utils';
// import { GameController } from './controller/gameController';
// const gameController = new GameController();
import { GameRepository } from './repository/gameRepository';
const gameRepository = new GameRepository();
import { SessionRepository } from './repository/socketConnectionRepository';
const sessionRepository = new SessionRepository();


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

import { Game } from './gamelogic/game';

type GameDTO = {
    gameID: string;
    game: Game;
}

function sendGameUpdateHost(gameID: string) {
    const game = gameRepository.getGame(gameID);
    const gameDTO = {
        gameID: gameID,
        game: game
    }
    const host = game?.getHost();
    const host_socket = sessionRepository.getSocketID(host || '');
    io.to(host_socket || '').emit('host:game-update', gameDTO);
}

function sendGameUpdatePlayers(gameID: string) {
    const game = gameRepository.getGame(gameID);
    const gameDTO = {
        gameID: gameID,
        game: game
    }
    const players = game?.getPlayers();
    players?.forEach((player) => {
        const player_socket = sessionRepository.getSocketID(player || '');
        io.to(player_socket || '').emit('player:game-update', gameDTO);
    })
}

io.on('connection', (socket_before) => {

    const socket = socket_before as CustomSocket;
    socket.emit("session", socket.sessionID);

    socket.on('host:create-game', () => {
        const gameID = generateGameID();
        const hostID = socket.sessionID;
        gameRepository.addGame(gameID, new Game(hostID));
        const game = gameRepository.getGame(gameID);
        if (game) {
            sendGameUpdateHost(gameID);
        } else {
            console.log('error with creating game');
        }
    })

    socket.on('player:join-game', (gameID) => {
        const game = gameRepository.getGame(gameID);
        if (game) {
            game.addPlayer(socket.sessionID);
            sendGameUpdatePlayers(gameID);
            sendGameUpdateHost(gameID);
        } else {
            socket.emit('player:invalid-game', gameID);
            console.log('error with joining game');
        }
    })

})

server.listen(5000, () => {
    console.log('listening');
});