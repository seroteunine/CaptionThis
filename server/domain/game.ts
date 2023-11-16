export enum Phase {
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

export class Game {

    gamePhase: Phase;
    players: string[];

    constructor() {
        this.gamePhase = Phase.PHOTO_UPLOAD;
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