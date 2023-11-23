import { Game, Phase } from '../game';

//Mock
const photo = new ArrayBuffer(123);
const player1 = 'teun';
const player2 = 'joep';
const player3 = 'karel';
const player4 = 'piet';

function setGameOnCaptionPhase(game: Game) {
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3)
    game.addPlayer(player4)

    game.addPhoto(player1, photo);
    game.addPhoto(player2, photo);
    game.addPhoto(player3, photo);
    game.addPhoto(player4, photo);

    game.nextPhase();
}

function addCaptionsAndGoToVotePhase(game: Game) {
    game.addCaption(player1, 'a caption', player2);
    game.addCaption(player1, 'a second caption', player3);
    game.addCaption(player1, 'a third caption', player4);
    game.addCaption(player2, 'a caption', player1);
    game.addCaption(player2, 'a second caption', player3);
    game.addCaption(player2, 'a third caption', player4);
    game.addCaption(player3, 'a caption', player2);
    game.addCaption(player3, 'a second caption', player1);
    game.addCaption(player3, 'a third caption', player4);
    game.addCaption(player4, 'a caption', player2);
    game.addCaption(player4, 'a second caption', player1);
    game.addCaption(player4, 'a third caption', player3);

    game.nextPhase();
}

//Tests

test('New gamestate object is on photoUpload phase', () => {
    const game = new Game();
    expect(game.getCurrentPhase()).toBe(Phase.PHOTO_UPLOAD);
});

test('Game doesnt go to captioning, if not every player has a photo', () => {
    const game = new Game();

    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3)
    game.addPlayer(player4)

    game.addPhoto(player1, photo);
    game.addPhoto(player2, photo);

    game.nextPhase();

    expect(game.gamePhase).toBe(Phase.PHOTO_UPLOAD);
})

test('Game goes to captioning, if every player has a photo', () => {
    const game = new Game();

    setGameOnCaptionPhase(game);

    expect(game.gamePhase).toBe(Phase.CAPTION);
})

test('Captioning own photo throws error', () => {
    const game = new Game();

    setGameOnCaptionPhase(game);

    expect(() => {
        game.addCaption(player1, 'a caption', player1)
    }).toThrow();
})

test('game doesnt go to voting if not every photo has a caption of all players', () => {
    const game = new Game();

    setGameOnCaptionPhase(game);

    game.addCaption(player1, 'a caption', player2);
    game.addCaption(player3, 'a caption', player2);

    game.nextPhase();

    expect(game.getCurrentPhase()).toBe(Phase.CAPTION);

})

test('game goes to voting if every photo has a caption of all players', () => {
    const game = new Game();

    setGameOnCaptionPhase(game);
    addCaptionsAndGoToVotePhase(game);

    expect(game.getCurrentPhase()).toBe(Phase.VOTING);
})

test('Caption has 2 votes when 2 people voted on it.', () => {
    const game = new Game();

    setGameOnCaptionPhase(game);
    addCaptionsAndGoToVotePhase(game);

    const captionID = 10;
    game.addVote(player1, captionID);
    game.addVote(player2, captionID);

    const Caption10 = game.captions[captionID];
    expect(Caption10.votedBy).toStrictEqual([player1, player2]);

})

test('Throw error when vote on your own caption. (Frontend should prohibit this)', () => {
    const game = new Game();

    setGameOnCaptionPhase(game);
    addCaptionsAndGoToVotePhase(game);

    const captionID = 1;

    expect(() => {
        game.addVote(player1, captionID);
    }).toThrow();

})

test('Vote array stays the same person votes multiple times', () => {
    const game = new Game();

    setGameOnCaptionPhase(game);
    addCaptionsAndGoToVotePhase(game);

    const captionID = 10;

    game.addVote(player1, captionID);
    game.addVote(player1, captionID);
    game.addVote(player1, captionID);
    game.addVote(player2, captionID);

    const Caption10 = game.captions[captionID];

    expect(Caption10.votedBy).toStrictEqual([player1, player2]);

})