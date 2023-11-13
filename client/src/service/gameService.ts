import { Socket } from "socket.io-client";

class GameService {
    socket;
    game;
    constructor(socket: Socket, GameState: any) {
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
        console.log('Game started');
    }

}