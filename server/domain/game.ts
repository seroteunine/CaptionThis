export enum Phase {
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

type Caption = {
    authorPlayerID: string;
    ownerPlayerID: string;
    captionText: string;
    votedBy: string[];
}

export class Game {

    gamePhase: Phase;
    playerNames: string[];
    photos: Map<string, ArrayBuffer>;
    captions: Caption[];

    constructor() {
        this.gamePhase = Phase.PHOTO_UPLOAD;
        this.playerNames = [];
        this.photos = new Map<string, ArrayBuffer>();
        this.captions = [];
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
        for (const [ownerOfPhoto] of this.photos) {
            const captionsForPhoto = this.captions.filter((caption) => caption.ownerPlayerID === ownerOfPhoto);

            if (!captionsForPhoto) {
                return false;
            }

            const otherPlayers = this.playerNames.filter(player => player !== ownerOfPhoto);
            for (const player of otherPlayers) {
                const captionExists = captionsForPhoto.some(
                  (caption) => caption.ownerPlayerID === ownerOfPhoto && caption.authorPlayerID === player
                );
          
                if (!captionExists) {
                  return false;
                }
              }
            }
            return true;
    }

    addCaption(author: string, captionText: string, ownerOfPhoto: string) {
        this.checkValidCaption(author, ownerOfPhoto);
        const caption: Caption = {
            authorPlayerID: author,
            ownerPlayerID: ownerOfPhoto,
            captionText: captionText,
            votedBy: [],
        }
        this.captions.push(caption);
    }

    checkValidCaption(author: string, ownerOfPhoto: string) {
        if (author === ownerOfPhoto) {
            throw new Error('Not allowed to caption your own photo.');
        }
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            playerNames: this.playerNames,
            photos: Object.fromEntries(this.photos.entries()),
            captions: this.captions
        }
    }

};