import { Game, Phase } from '../game';

// Define mock global parameters that all tests can use
const gameID: string = 'aB12';
const host: string = 'abcd1234'

test('New gamestate object is on waiting phase', () => {
    const game = new Game(gameID, host);
    expect(game.getCurrentPhase()).toBe(Phase.WAITING);
});

test('start game should go to photo upload phase', () => {
    const game = new Game(gameID, host);

    game.startGame();

    expect(game.getCurrentPhase()).toBe(Phase.PHOTO_UPLOAD);
});

test('no double players', () => {
    const game = new Game(gameID, host);

    game.addPlayer('a123');

    expect(() => {
        game.addPlayer('a123');
    }).toThrow();
})