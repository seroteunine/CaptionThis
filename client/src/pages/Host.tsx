import { MouseEventHandler } from "react"

type GameDTO = {
    gameID: string;
    phase: string;
    host: string;
    players: string[];
}

function Host({ gameDTO, startGame }: { gameDTO: GameDTO, startGame: MouseEventHandler<HTMLButtonElement> }) {

    return (
        <>
            <h1>Room: {gameDTO.gameID} - You're the host</h1>
            <h2>Gamephase: {gameDTO.phase}</h2>
            <button onClick={startGame}> Start game </button>
            <h2>Players in this game:</h2>
            {gameDTO.players.map((player) => (
                <h3 key={player}>{player}</h3>
            ))}
        </>
    )
}

export default Host
