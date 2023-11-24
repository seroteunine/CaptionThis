import socket from '../socket';


export function createRoom() {
    socket.emit('host:create-room');
}

export function joinRoom(roomCode: string) {
    socket.emit('player:join-room', roomCode);
}

export function sendName(username: string) {
    socket.emit('player:set-name', { roomID: sessionStorage.getItem('roomID'), username: username });
}

export function sendFile(file: File) {
    socket.emit('player:send-image', { roomID: sessionStorage.getItem('roomID'), file: file });
}

export function startGame() {
    socket.emit('host:start-game', sessionStorage.getItem('roomID'));
}

export function goNextPhase() {
    socket.emit('host:next-phase', sessionStorage.getItem('roomID'))
}

export function sendCaption(caption: string, ownerOfPhoto: string) {
    const captionDTO = {
        roomID: sessionStorage.getItem('roomID'),
        caption: caption,
        ownerOfPhoto: ownerOfPhoto
    }
    socket.emit('player:send-caption', captionDTO)
}

export function sendNextPhotoRequest(currentIndex: number) {
    socket.emit('host:request-next-photo', { roomID: sessionStorage.getItem('roomID'), currentIndex: currentIndex });
}

export function sendVote(ID: number, photoRound: number) {
    socket.emit('player:send-vote', { roomID: sessionStorage.getItem('roomID'), captionID: ID, photoRound: photoRound });
}

export function getScore() {
    socket.emit('host:get-score', sessionStorage.getItem('roomID'));
}

export function emitDeleteGame() {
    socket.emit('host:delete-room', sessionStorage.getItem('roomID'));
}