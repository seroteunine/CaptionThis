export enum Phase {
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

export class Game {

    gamePhase: Phase;
    players: string[];
    photos: ArrayBuffer[];

    constructor() {
        this.gamePhase = Phase.PHOTO_UPLOAD;
        this.players = [];
        this.photos = [];
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

    addPhoto(photo: ArrayBuffer) {
        this.photos.push(photo);
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            players: this.players,
            photos: this.photos
        }
    }

};