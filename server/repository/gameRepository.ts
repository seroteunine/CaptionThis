import { Game } from "../gamelogic/game";

export class GameRepository {

    games: Map<string, Game>;

    constructor() {
        this.games = new Map<string, Game>();
    }

    addGame(roomID: string, game: Game) {
        this.games.set(roomID, game);
    }

    getGame(roomID: string) {
        return this.games.get(roomID);
    }

    saveGame(roomID: string, game: Game) {
        this.games.set(roomID, game);
    }

}