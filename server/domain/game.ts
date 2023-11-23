export enum Phase {
    PHOTO_UPLOAD = "PHOTO_UPLOAD",
    CAPTION = "CAPTION",
    VOTING = "VOTING",
    END = "END",
};

type Caption = {
    ID: number;
    authorPlayerID: string;
    photoOwnerPlayerID: string;
    captionText: string;
    votedBy: string[];
}

export class Game {

    gamePhase: Phase;
    playerIDs: Set<string>;
    photos: Map<string, ArrayBuffer>;
    captions: Caption[];

    constructor(playerIDs: Set<string>) {
        this.gamePhase = Phase.PHOTO_UPLOAD;
        this.playerIDs = playerIDs;
        this.photos = new Map<string, ArrayBuffer>();
        this.captions = [];
    };

    getPlayers() {
        return this.playerIDs;
    }

    getCurrentPhase() {
        return this.gamePhase;
    };

    addPhoto(playerID: string, photo: ArrayBuffer) {
        this.photos.set(playerID, photo);
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
        return Array.from(this.playerIDs).every(playerID => this.photos.has(playerID));
    }

    checkAllPhotosHaveCaption() {
        for (const [ownerOfPhoto] of this.photos) {
            const captionsForPhoto = this.captions.filter((caption) => caption.photoOwnerPlayerID === ownerOfPhoto);

            if (!captionsForPhoto) {
                return false;
            }

            const otherPlayers = Array.from(this.playerIDs).filter(player => player !== ownerOfPhoto);
            for (const player of otherPlayers) {
                const captionExists = captionsForPhoto.some(
                    (caption) => caption.photoOwnerPlayerID === ownerOfPhoto && caption.authorPlayerID === player
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
            ID: this.captions.length,
            authorPlayerID: author,
            photoOwnerPlayerID: ownerOfPhoto,
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

    getCaptionedPhoto(currentIndex: number) {
        const photoOwner = Array.from(this.photos.keys())[currentIndex];
        const captions = this.captions
            .filter((caption) => caption.photoOwnerPlayerID === photoOwner)
            .map(({ authorPlayerID, captionText }) => ({
                authorPlayerID,
                captionText,
            }));
        const captionedPhoto = {
            owner: photoOwner,
            captions: captions
        }
        return captionedPhoto;
    }

    addVote(playerID: string, captionID: number) {
        const caption: Caption = this.captions[captionID];
        if (caption.authorPlayerID === playerID) {
            throw new Error('Player can not vote on own caption');
        }
        if (!caption.votedBy.includes(playerID)) {
            caption.votedBy.push(playerID);
        }
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            playerIDs: Array.from(this.playerIDs),
            photos: Object.fromEntries(this.photos.entries()),
            captions: this.captions
        }
    }

};