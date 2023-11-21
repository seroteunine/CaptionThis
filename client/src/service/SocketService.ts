import socket from '../socket';


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

export function goNextPhase(roomID: string) {
    socket.emit('host:next-phase', roomID)
}

export function sendCaption(caption: string, ownerOfPhoto: string) {
    socket.emit('player:send-caption', {
        caption: caption,
        ownerOfPhoto: ownerOfPhoto
    })
}
