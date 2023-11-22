import { Game, Phase } from "./game";

export class Room {

    roomID: string;
    hostID: string;
    playersIDToName: Map<string, string>;

    game: Game | undefined;

    constructor(roomID: string, hostID: string) {
        this.roomID = roomID;
        this.hostID = hostID;
        this.playersIDToName = new Map<string, string>();
        this.game = undefined;
    }

    getHostID() {
        return this.hostID;
    }

    addPlayer(playerID: string) {
        if (!this.playersIDToName.has(playerID) && !this.hasGame()) {
            this.playersIDToName.set(playerID, playerID);
        }
    }

    setPlayerName(playerID: string, playerName: string) {
        if (!this.playersIDToName.has(playerID)) {
            throw new Error('Name could not be set because the playerID is not in the room.');
        }
        if (this.game) {
            throw new Error('Name could not be set because the game already started.');
        }
        this.playersIDToName.set(playerID, playerName);
    }

    getPlayers() {
        return this.playersIDToName;
    }

    getRoomDTO() {
        return {
            roomID: this.roomID,
            hostID: this.hostID,
            playersIDToName: Object.fromEntries(this.playersIDToName.entries()),
            game: this.game ? this.game.getGameDTO() : undefined
        }
    }

    tryStartGame() {
        if (this.playersIDToName.size >= 4 && this.playersIDToName.size <= 8) {
            this.game = new Game();
            for (const playerName of this.playersIDToName.values()) {
                this.game.addPlayer(playerName);
            }
        }
    }

    hasGame() {
        return this.game ? true : false;
    }

    addPhoto(playerID: string, photo: ArrayBuffer) {
        const playerName = this.playersIDToName.get(playerID);
        if (this.hasGame() && this.game?.gamePhase === Phase.PHOTO_UPLOAD && playerName) {
            this.game.addPhoto(playerName, photo);
        }
    }

}