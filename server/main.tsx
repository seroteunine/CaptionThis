const express = require('express')
const app = express();
const http = require('http')

import { Server, Socket } from 'socket.io'
import { Game } from './domain/game';
import { generateGameID, generateSessionID } from './utils';
import { GameManager } from './managers/gameManager';
import { SocketManager } from './managers/socketManager';

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
    gameID: string;
    phase: string;
    host: string;
    players: string[];
}


function sendHostGameUpdate(game: Game) {
    const host = game.getHost();
    const gameDTO: GameDTO = game.returnGameDTO();
    const host_socket = socketManager.getSocketID(host || '');
    io.to(host_socket || '').emit('host:game-update', gameDTO);
}

function sendPlayersGameUpdate(game: Game) {
    const players = game.getPlayers();
    const gameDTO: GameDTO = game.returnGameDTO();
    players.forEach((player) => {
        const player_socket = socketManager.getSocketID(player);
        io.to(player_socket || '').emit('player:game-update', gameDTO);
    })
}

function resendGameIfExists(sessionID: string) {
    const game = gameManager.getGameBySessionID(sessionID);
    if (game) {
        sendHostGameUpdate(game);
        sendPlayersGameUpdate(game);
    }
}


const gameManager = new GameManager();
const socketManager = new SocketManager();

io.use((socket_before, next) => {
    const socket = socket_before as CustomSocket;
    let sessionID = socket.handshake.auth.sessionID;
    if (!sessionID) {
        sessionID = generateSessionID();
    }
    socket.sessionID = sessionID;
    socketManager.addMapping(socket.sessionID, socket.id);
    next();
});

io.on('connection', (socket_before) => {

    const socket = socket_before as CustomSocket;

    socket.emit("session", socket.sessionID);
    resendGameIfExists(socket.sessionID);

    socket.on('host:create-game', () => {
        const gameID = generateGameID();
        const hostID = socket.sessionID;
        const game = new Game(gameID, hostID);
        gameManager.addGame(game);
        sendHostGameUpdate(game);
    })

    socket.on('player:join-game', (gameID) => {
        const game = gameManager.getGame(gameID);
        if (!game) {
            socket.emit('player:invalid-game', gameID);
            return;
        }
        game.addPlayer(socket.sessionID);
        sendPlayersGameUpdate(game);
        sendHostGameUpdate(game);
    })

    socket.on('host:start-game', (gameID) => {
        console.log('started game with code: ', gameID);
        const game = gameManager.getGame(gameID);
        if (!game) {
            socket.emit('host:error', 'Game could not be started, because it couldnt be found.')
            return;
        }
        game.startGame();
        sendHostGameUpdate(game);
        sendPlayersGameUpdate(game);
    })

})

server.listen(5000, () => {
    console.log('listening');
});