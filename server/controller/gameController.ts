import { Game } from '../gamelogic/game';

export class GameController {

    getCurrentPhase(game: Game) {
        return game.getCurrentPhase();
    }

}