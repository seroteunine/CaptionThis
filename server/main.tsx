const express = require('express')
const app = express();
const http = require('http')
import { Server } from 'socket.io'

const server = http.Server(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`${socket.id} connected.`);
    io.emit(`${socket.id} connected.`);
})

server.listen(5000, () => {
    console.log('listening');
});