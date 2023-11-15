type GameDTO = {
    gameID: string;
    phase: string;
    host: string;
    players: string[];
}

function Player({ gameDTO }: { gameDTO: GameDTO }) {

    return (
        <>
            <h1>Room: {gameDTO.gameID} - You're a player</h1>
            <h2>Phase: {gameDTO.phase}</h2>
            <h2>Players in this game:</h2>
            {gameDTO.players.map((player) => (
                <h3 key={player}>{player}</h3>
            ))}
        </>
    )
}

export default Player
