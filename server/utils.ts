const uuid = require('uuid');

export function generateRoomID(): string {
    const randomNum = Math.floor(Math.random() * 10000);
    return String(randomNum).padStart(4, '0');
}

export function generatePlayerID(): string {
    const randomUUID = uuid.v4().replace(/-/g, '');
    return randomUUID.substr(0, 8);
}
