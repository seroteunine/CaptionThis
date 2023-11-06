const uuid = require('uuid')

function generateRoomID() {
    const randomUUID = uuid.v4().replace(/-/g, '');
    return randomUUID.substr(0, 4);
}

module.exports = generateRoomID;