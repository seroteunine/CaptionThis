import { Game } from "./gamelogic/game";

class Room {

    host: string;
    game: Game | undefined;

    constructor(hostID: string) {
        this.host = hostID;
        this.game = undefined;
    }

    setGame(game: Game) {
        this.game = game;
    }

    getHost() {
        return this.host;
    }

    getGame() {
        return this.game;
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