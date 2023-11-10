enum Phase {
    WAITING,
    PHOTO_UPLOAD,
    CAPTION,
    VOTING,
    END
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
            console.log('mag niet');
        }
    };

    getCurrentPhase() {
        return this.gamePhase;
    };

};