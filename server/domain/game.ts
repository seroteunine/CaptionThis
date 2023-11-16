export enum Phase {
    WAITING = "WAITING",
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

export class Game {

    gamePhase: Phase;
    players: string[];

    constructor() {
        this.gamePhase = Phase.WAITING;
        this.players = [];
    };

    getPlayers() {
        return this.players;
    }

    addPlayer(player: string) {
        if (this.players.includes(player)) {
            throw new Error();
        }
        this.players.push(player);
    }

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

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            players: this.players
        }
    }

};