const { GameState, Phase } = require('../gameState');

test('New gamestate object is on waiting phase', () => {
    const game = new GameState();
    expect(game.getCurrentPhase()).toBe(Phase.WAITING);
});


test('Should pass', () => {
    expect(true).toBe(true);
});