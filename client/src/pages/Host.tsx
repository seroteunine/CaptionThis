import { MouseEventHandler } from "react"

type GameDTO = {
    gameID: string;
    gameState: {
        phase: string;
        host: string;
        players: string[];
    };
}

function Host({ gameState, startGame }: { gameState: GameDTO, startGame: MouseEventHandler<HTMLButtonElement> }) {

    return (
        <>
            <h1>WaitingRoom - Host</h1>
            {gameState.gameID}
            <button onClick={startGame}> Start game </button>
        </>
    )
}

export default Host
