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

    nextPhase() {
        switch (this.gamePhase) {
            case Phase.PHOTO_UPLOAD:
                if (this.checkAllPlayersHavePhoto()) {
                    console.log('true apparently', this.photos);

                    this.gamePhase = Phase.CAPTION;
                }
                break;
            case Phase.CAPTION:
                this.gamePhase = Phase.VOTING;
                break;
            case Phase.VOTING:
                this.gamePhase = Phase.END;
                break;
            case Phase.END:
                throw new Error("Game is already in the final phase");
            default:
                throw new Error("Invalid game phase");
        }
    }

    checkAllPlayersHavePhoto() {
        return this.playerNames.every(playerName => this.photos.has(playerName));
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            playerNames: this.playerNames,
            photos: Object.fromEntries(this.photos.entries())
        }
    }

};