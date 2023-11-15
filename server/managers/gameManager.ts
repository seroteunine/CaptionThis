import { Game } from "../domain/game";

export class GameManager {

    games: Map<string, Game>;

    constructor() {
        this.games = new Map<string, Game>();
    }

    addGame(game: Game) {
        this.games.set(game.gameID, game);
    }

    getGame(gameID: string) {
        return this.games.get(gameID);
    }

    getGameBySessionID(sessionID: string) {
        for (let game of this.games.values()) {
            const players = game.getPlayers();
            if (players.includes(sessionID) || game.getHost() === sessionID) {
                return game;
            }
        }
        return undefined;
    }

}