import { Game, Phase } from "./game";

export class Room {

    roomID: string;
    hostID: string;
    playerIDs: Set<string>;

    game: Game | undefined;

    constructor(roomID: string, hostID: string) {
        this.roomID = roomID;
        this.hostID = hostID;
        this.playerIDs = new Set();
        this.game = undefined;
    }

    getHostID() {
        return this.hostID;
    }

    addPlayer(playerID: string) {
        if (!this.playerIDs.has(playerID) && !this.hasGame()) {
            this.playerIDs.add(playerID);
        }
    }

    setPlayerName(playerID: string, playerName: string) {
        if (!this.playerIDs.has(playerID)) {
            throw new Error('Name could not be set because the playerID is not in the room.');
        }
        if (this.game) {
            throw new Error('Name could not be set because the game already started.');
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

}