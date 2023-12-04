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
}

type Vote = {
    playerID: string;
    captionID: number;
}

export class Game {

    gamePhase: Phase;
    playerIDs: Set<string>;
    photos: Map<string, ArrayBuffer>;
    captions: Caption[];
    votes: Map<number, Vote[]>;
    votingRound: number;
    score: Map<string, number>;
    POINTS_PER_VOTE = 100;

    constructor(playerIDs: Set<string>, initialScores?: Map<string, number>) {
        this.gamePhase = Phase.PHOTO_UPLOAD;
        this.playerIDs = playerIDs;
        this.photos = new Map<string, ArrayBuffer>();
        this.captions = [];
        this.votes = new Map<number, Vote[]>();
        this.votingRound = 1;
        this.score = new Map<string, number>();

        this.votes.set(this.votingRound, [])

        this.score = initialScores ? new Map(initialScores) : new Map();
        if (!initialScores) {
            this.initScore();
        }

    };

    initScore() {
        for (let player of this.playerIDs) {
            this.score.set(player, 0);
        }
    }

    getPlayers() {
        return this.playerIDs;
    }

    getCurrentPhase() {
        return this.gamePhase;
    };

    addPhoto(playerID: string, photo: ArrayBuffer) {
        this.photos.set(playerID, photo);
    }

    tryNextPhase() {
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
                if (this.hasEveryoneVotedThisRound()) {
                    this.nextVotingRound();
                }
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
        }
        this.captions.push(caption);
    }

    checkValidCaption(author: string, ownerOfPhoto: string) {
        if (author === ownerOfPhoto) {
            throw new Error('Not allowed to caption your own photo.');
        }
    }

    addVote(playerID: string, captionID: number) {
        const caption: Caption = this.captions[captionID];
        if (caption.authorPlayerID === playerID) {
            throw new Error('Player can not vote on own caption');
        }
        const votesThisRound = this.votes.get(this.votingRound);
        const vote = { playerID, captionID };
        if (!this.playerHasAlreadyVotedThisRound(playerID)) {
            votesThisRound?.push(vote);
            this.addPoint(caption.authorPlayerID);
        }
    }

    removeVote(playerID: string) {
        const votesThisRound = this.votes.get(this.votingRound);
        if (votesThisRound) {
            const excludedArray = votesThisRound?.filter((vote) => vote.playerID !== playerID);
            this.votes.set(this.votingRound, excludedArray);
        }
    }

    playerHasAlreadyVotedThisRound(playerID: string) {
        const votes = this.votes.get(this.votingRound);
        return votes?.some((vote) => vote.playerID === playerID);
    }

    nextVotingRound() {
        this.votingRound += 1;
        if (this.votingRound === this.photos.size + 1) {
            this.gamePhase = Phase.END;
        } else {
            this.votes.set(this.votingRound, []);
        }
    }

    hasEveryoneVotedThisRound() {
        const votes = this.votes.get(this.votingRound);
        return votes?.length === this.playerIDs.size;
    }

    addPoint(playerID: string) {
        if (this.score.has(playerID)) {
            let currentValue = this.score.get(playerID)!;
            this.score.set(playerID, currentValue + this.POINTS_PER_VOTE);
        }
    }

    getGameDTO() {
        return {
            phase: this.gamePhase.toString(),
            playerIDs: Array.from(this.playerIDs),
            captions: this.captions,
            votes: Object.fromEntries(this.votes.entries()),
            votingRound: this.votingRound,
            score: Object.fromEntries(this.score.entries()),
        }
    }

    getPhotosDTO() {
        return {
            photos: Object.fromEntries(this.photos.entries())
        }
    }

};