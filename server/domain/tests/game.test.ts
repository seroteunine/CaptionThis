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