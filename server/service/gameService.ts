import { Socket } from "socket.io";

export class GameService {
    socket;
    game;
    constructor(socket: Socket) {
        this.socket = socket;
        this.game = new GameState();
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        this.socket.on('client:set-name', (playerName) => {
            this.setNameOfPlayer(playerName);
        });
    }

    setNameOfPlayer(playerName: string) {
        this.game.addPlayer(playerName);
    }

    startGame() {
        this.game.s
    }

}