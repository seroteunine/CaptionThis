const uuid = require('uuid');

export function generateRoomID(): string {
    const randomUUID = uuid.v4().replace(/-/g, '');
    return randomUUID.substr(0, 4);
}

