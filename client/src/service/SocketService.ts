import socket from '../socket';

//Emitters
export function createRoom() {
    socket.emit('host:create-room');
}

export function joinRoom(roomCode: string) {
    socket.emit('player:join-room', roomCode);
}

export function sendName(username: string) {
    socket.emit('player:set-name', username);
}

export function sendFile(file: File) {
    socket.emit('player:send-image', file);
}

export function startGame(roomID: string) {
    socket.emit('host:start-game', roomID);
}

