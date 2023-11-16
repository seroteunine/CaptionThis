import { Game } from "./game";

export class Room {

    roomID: string;
    hostID: string;
    playerIDs: string[];

    game: Game | undefined;

    constructor(roomID: string, hostID: string) {
        this.roomID = roomID;
        this.hostID = hostID;
        this.playerIDs = [];
        this.game = undefined;
    }

    getHostID() {
        return this.hostID;
    }

    addPlayer(playerID: string) {
        if (!this.playerIDs.includes(playerID) && !this.game) {
            this.playerIDs.push(playerID);
        }
    }

    getPlayers() {
        return this.playerIDs;
    }

    getRoomDTO() {
        return {
            roomID: this.roomID,
            hostID: this.hostID,
            playerIDs: this.playerIDs,
            game: this.game ? this.game.getGameDTO() : undefined
        }
    }

    startGame() {
        if (this.playerIDs.length >= 3 && this.playerIDs.length <= 8) {
            this.game = new Game();
        }
    }

}