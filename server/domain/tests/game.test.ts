import { Game, Phase } from '../game';

test('New gamestate object is on waiting phase', () => {
    const game = new Game();
    expect(game.getCurrentPhase()).toBe(Phase.WAITING);
});

test('start game should go to photo upload phase', () => {
    const game = new Game();

    game.startGame();

    expect(game.getCurrentPhase()).toBe(Phase.PHOTO_UPLOAD);
});

test('no starting when its not in waiting phase', () => {
    const game = new Game();

    game.startGame();

    expect(() => {
        game.startGame();
    }).toThrow();
});

test('no double players', () => {
    const game = new Game();

    game.addPlayer('a123');

    expect(() => {
        game.addPlayer('a123');
    }).toThrow();
})