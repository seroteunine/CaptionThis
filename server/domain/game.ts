export enum Phase {
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

export class Game {

    gamePhase: Phase;
    playerNames: string[];
    photos: Map<string, ArrayBuffer>;

    constructor() {
        this.gamePhase = Phase.PHOTO_UPLOAD;
        this.playerNames = [];
        this.photos = new Map<string, ArrayBuffer>();
    };

    getPlayers() {
        return this.playerNames;
    }

    addPlayer(player: string) {
        if (this.playerNames.includes(player)) {
            throw new Error();
        }
        this.playerNames.push(player);
    }

    getCurrentPhase() {
        return this.gamePhase;
    };

    addPhoto(playerName: string, photo: ArrayBuffer) {
        this.photos.set(playerName, photo);
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            playerNames: this.playerNames,
            photos: Object.fromEntries(this.photos.entries())
        }
    }

};