class Room {

    host: string;
    players: string[];

    constructor(hostID: string) {
        this.host = hostID;
        this.players = [];
    }

    getHost() {
        return this.host;
    }

    addPlayer(playerID: string) {
        this.players.push(playerID);
    }

    getPlayers() {
        return this.players;
    }

}

export class RoomRepository {

    rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    addRoom(roomID: string, hostID: string) {
        const room = new Room(hostID);
        this.rooms.set(roomID, room);
    }

    getRoom(roomID: string) {
        return this.rooms.get(roomID);
    }

}