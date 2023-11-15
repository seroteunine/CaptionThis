import { Game } from "../domain/game";

export class GameManager {

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

}