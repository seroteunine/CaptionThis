export enum Phase {
    WAITING,
    PHOTO_UPLOAD,
    CAPTION,
    VOTING,
    END,
};

export class GameState {

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

};