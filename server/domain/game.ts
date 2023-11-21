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
    captions: Map<string, Map<string, string>>; //Map<ownerOfPhoto(=photo_identifier), Map<authorOfCaption, caption>>

    constructor() {
        this.gamePhase = Phase.PHOTO_UPLOAD;
        this.playerNames = [];
        this.photos = new Map<string, ArrayBuffer>();
        this.captions = new Map<string, Map<string, string>>();
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
                    this.gamePhase = Phase.CAPTION;
                }
                break;
            case Phase.CAPTION:
                if (this.checkAllPhotosHaveCaption()) {
                    this.gamePhase = Phase.VOTING;
                }
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

    checkAllPhotosHaveCaption() {
        return true;
    }

    addCaption(author: string, caption: string, ownerOfPhoto: string) {
        let captionsForPhoto = this.captions.get(ownerOfPhoto);
        if (!captionsForPhoto) {
            captionsForPhoto = new Map<string, string>();
            this.captions.set(ownerOfPhoto, captionsForPhoto);
        }
        captionsForPhoto.set(author, caption);
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            playerNames: this.playerNames,
            photos: Object.fromEntries(this.photos.entries()),
            captions: Object.fromEntries(
                Array.from(this.captions.entries()).map(([owner, captionsMap]) =>
                    [owner, Object.fromEntries(captionsMap)]))
        }
    }

};