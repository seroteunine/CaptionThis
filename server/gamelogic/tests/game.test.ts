const { Game, Phase } = require('../gameState');

test('New gamestate object is on waiting phase', () => {
    const game = new Game();
    expect(game.getCurrentPhase()).toBe(Phase.WAITING);
});

test('start game should go to photo upload phase', () => {
    const game = new Game();

    game.startGame();

    expect(game.getCurrentPhase()).toBe(Phase.PHOTO_UPLOAD);
});