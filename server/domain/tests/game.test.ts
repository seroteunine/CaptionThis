import { Game, Phase } from '../game';

//Mock
const photo = new ArrayBuffer(123);

test('New gamestate object is on photoUpload phase', () => {
    const game = new Game();
    expect(game.getCurrentPhase()).toBe(Phase.PHOTO_UPLOAD);
});

test('Game doesnt go to captioning, if not every player has a photo', () => {
    const game = new Game();

    game.addPlayer('teun');
    game.addPlayer('joep');

    game.addPhoto('teun', photo);

    game.nextPhase();

    expect(game.gamePhase).toBe(Phase.PHOTO_UPLOAD);
})

test('Game goes to captioning, if every player has a photo', () => {
    const game = new Game();

    game.addPlayer('teun');
    game.addPlayer('joep');

    game.addPhoto('teun', photo);
    game.addPhoto('joep', photo);

    game.nextPhase();

    expect(game.gamePhase).toBe(Phase.CAPTION);
})

test('Captioning own photo throws error', () => {
    const game = new Game();

    game.addPlayer('teun');
    game.addPlayer('joep');
    game.addPlayer('klaas')

    game.addPhoto('teun', photo);
    game.addPhoto('joep', photo);
    game.addPhoto('klaas', photo);

    game.nextPhase();

    expect(() => {
        game.addCaption('teun', 'a caption', 'teun')
    }).toThrow();
})

test('game doesnt go to voting if not every photo has a caption of all players', () => {
    const game = new Game();

    game.addPlayer('teun');
    game.addPlayer('joep');
    game.addPlayer('klaas')

    game.addPhoto('teun', photo);
    game.addPhoto('joep', photo);
    game.addPhoto('klaas', photo);

    game.nextPhase();

    game.addCaption('teun', 'a caption', 'joep');
    game.addCaption('klaas', 'a caption', 'joep');

    game.nextPhase();

    expect(game.getCurrentPhase()).toBe(Phase.CAPTION);

})

test('game goes to voting if every photo has a caption of all players', () => {
    const game = new Game();

    game.addPlayer('teun');
    game.addPlayer('joep');
    game.addPlayer('klaas')

    game.addPhoto('teun', photo);
    game.addPhoto('joep', photo);
    game.addPhoto('klaas', photo);

    game.nextPhase();

    game.addCaption('teun', 'a caption', 'joep');
    game.addCaption('teun', 'a second caption', 'klaas');
    game.addCaption('joep', 'a caption', 'teun');
    game.addCaption('joep', 'a second caption', 'klaas');
    game.addCaption('klaas', 'a caption', 'joep');
    game.addCaption('klaas', 'a second caption', 'teun');

    game.nextPhase();

    expect(game.getCurrentPhase()).toBe(Phase.VOTING);

})