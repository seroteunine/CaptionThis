const express = require('express')
const app = express();
const http = require('http')
import { Server, Socket } from 'socket.io'

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://10.10.2.105:5173",
        methods: ["GET", "POST"]
    }
});

import { Game } from './domain/game';
import { generateGameID, generateSessionID } from './utils';
import { GameManager } from './managers/gameManager';
import { SocketManager } from './managers/socketManager';
const gameManager = new GameManager();
const socketManager = new SocketManager();

type GameDTO = {
    gameID: string;
    gameState: {
        phase: string;
        host: string;
        players: string[];
    };
}

function sendHostGameUpdate(game: Game, gameID: string) {
    const host = game.getHost();
    const gameDTO: GameDTO = {
        gameID: gameID,
        gameState: {
            phase: game.getCurrentPhase().toString(),
            host: host,
            players: game.getPlayers()
        }
    }
    const host_socket = socketManager.getSocketID(host || '');
    io.to(host_socket || '').emit('host:game-update', gameDTO);
}

function sendPlayersGameUpdate(game: Game, gameID: string) {
    const players = game.getPlayers();
    const gameDTO: GameDTO = {
        gameID: gameID,
        gameState: {
            phase: game.getCurrentPhase().toString(),
            host: game.getHost(),
            players: players
        }
    }
    players.forEach((player) => {
        const player_socket = socketManager.getSocketID(player);
        io.to(player_socket || '').emit('player:game-update', gameDTO);
    })
}

function sendGameIfExists(sessionID: string) {
    const socketID = socketManager.getSocketID(sessionID)!;
    console.log(socketID);

    const game = gameManager.getGameBySessionID(sessionID);
    console.log(game);

    if (game) {
        const gameDTO: GameDTO = {
            gameID: 'test',
            gameState: {
                phase: game.getCurrentPhase().toString(),
                host: game.getHost(),
                players: game.getPlayers()
            }
        }
        io.to(socketID).emit('general:resend-game', gameDTO);
    }
}

interface CustomSocket extends Socket {
    sessionID: string;
}

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
    sendGameIfExists(socket.sessionID);

    socket.on('host:create-game', () => {
        const gameID = generateGameID();
        const hostID = socket.sessionID;
        const game = new Game(hostID);
        gameManager.addGame(gameID, game);
        sendHostGameUpdate(game, gameID);
    })

    socket.on('player:join-game', (gameID) => {
        const game = gameManager.getGame(gameID);
        if (game) {
            game.addPlayer(socket.sessionID);
            sendPlayersGameUpdate(game, gameID);
            sendHostGameUpdate(game, gameID);
        } else {
            socket.emit('player:invalid-game', gameID);
            console.log('error with joining game');
        }
    })

    socket.on('host:start-game', (gameID) => {
        console.log('started game with code: ', gameID);
        const game = gameManager.getGame(gameID);
        if (game) {
            game.startGame();
            sendHostGameUpdate(game, gameID);
            sendPlayersGameUpdate(game, gameID);
        } else {
            console.log('error starting game, could not be found in Manager.');
        }
    })

})

server.listen(5000, () => {
    console.log('listening');
});