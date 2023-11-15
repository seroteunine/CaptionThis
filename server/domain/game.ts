export enum Phase {
    WAITING = "WAITING",
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

export class Game {

    gameID: string;
    gamePhase: Phase;
    host: string;
    players: string[];

    constructor(gameID: string, host: string) {
        this.gameID = gameID;
        this.gamePhase = Phase.WAITING;
        this.host = host;
        this.players = [];
    };

    getHost() {
        return this.host;
    }

    getPlayers() {
        return this.players;
    }

    addPlayer(player: string) {
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

    returnGameDTO() {
        return {
            gameID: this.gameID,
            phase: this.gamePhase.toString(),
            host: this.host,
            players: this.players
        }
    }

};