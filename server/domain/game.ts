export enum Phase {
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

export class Game {

    gamePhase: Phase;
    players: string[];
    photos: Map<string, ArrayBuffer>;

    constructor() {
        this.gamePhase = Phase.PHOTO_UPLOAD;
        this.players = [];
        this.photos = new Map<string, ArrayBuffer>();
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

    addPhoto(sessionID: string, photo: ArrayBuffer) {
        this.photos.set(sessionID, photo);
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            players: this.players,
            photos: Object.fromEntries(this.photos.entries())
        }
    }

};