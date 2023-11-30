import { Game } from "./game";

export class Room {

    roomID: string;
    hostID: string;
    playerIDs: Set<string>;
    datetime_created: number;

    game: Game | undefined;

    constructor(roomID: string, hostID: string) {
        this.roomID = roomID;
        this.hostID = hostID;
        this.playerIDs = new Set();
        this.game = undefined;
        this.datetime_created = Date.now();
    }

    getHostID() {
        return this.hostID;
    }

    addPlayer(playerID: string) {
        if (!this.playerIDs.has(playerID) && !this.hasGame()) {
            this.playerIDs.add(playerID);
        }
    }

    getPlayers() {
        return this.playerIDs;
    }

    getRoomDTO() {
        return {
            roomID: this.roomID,
            hostID: this.hostID,
            playerIDs: Array.from(this.playerIDs),
            game: this.game ? this.game.getGameDTO() : undefined
        }
    }

    tryStartGame() {
        if (this.playerIDs.size >= 4 && this.playerIDs.size <= 8) {
            this.game = new Game(this.playerIDs);
        }
    }

    hasGame() {
        return this.game ? true : false;
    }

    createNextGame() {
        const score = this.game?.score;
        if (score) {
            this.game = new Game(this.playerIDs, score);
        } else {
            this.game = new Game(this.playerIDs);
        }
        this.datetime_created = Date.now();
    }

}