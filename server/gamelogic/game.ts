export enum Phase {
    WAITING = "WAITING",
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

export class Game {

    playerNames: string[];
    gamePhase: Phase;

    constructor() {
        this.playerNames = [];
        this.gamePhase = Phase.WAITING;
    };

    startGame() {
        if (this.gamePhase === Phase.WAITING) {
            this.gamePhase = Phase.PHOTO_UPLOAD;
        } else {
            throw new Error("Only allowed if phase is waiting");
        }
    };

    getCurrentPhase() {
        return this.gamePhase;
    };

    addPlayer(playerName: string) {
        this.playerNames.push(playerName);
    };

    getPlayers() {
        return this.playerNames;
    }

};