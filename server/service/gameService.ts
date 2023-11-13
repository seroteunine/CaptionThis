import { Game, Phase } from '../gamelogic/game';

interface GameDTO {
    gamePhase: Phase;
    playerNames: string[];
}

export class GameService {

    initGame() {
        return new Game();
    }

    getCurrentPhase(game: Game) {
        return game.getCurrentPhase();
    }

    addPlayer(game: Game, playerName: string) {
        game.addPlayer(playerName);
    }

    getPlayers(game: Game) {
        return game.getPlayers();
    }

    getGameDTO(game: Game): GameDTO {
        return {
            gamePhase: game.getCurrentPhase(),
            playerNames: game.getPlayers()
        };
    }

}