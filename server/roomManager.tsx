class Room {

    host: string;
    players: string[];

    constructor(hostID: string) {
        this.host = hostID;
        this.players = [];
    }

    addPlayer(playerID: string) {
        this.players.push(playerID);
    }

    getPlayers() {
        return this.players;
    }

    getHost() {
        return this.host;
    }

}

class roomManager {

    rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    addRoom(roomID: string, hostID: string) {
        this.rooms.set(roomID, new Room(hostID));
    }

    getRoom(roomID: string) {
        return this.rooms.get(roomID);
    }

}

module.exports = roomManager;