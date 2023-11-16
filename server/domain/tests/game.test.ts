import { Game, Phase } from '../game';

test('New gamestate object is on photoUpload phase', () => {
    const game = new Game();
    expect(game.getCurrentPhase()).toBe(Phase.PHOTO_UPLOAD);
});