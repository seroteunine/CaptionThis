type GameDTO = {
    gameID: string;
    gameState: {
        phase: string;
        host: string;
        players: string[];
    };
}

function Player({ gameState }: { gameState: GameDTO }) {

    return (
        <>
            <h1>WaitingRoom - Player</h1>
            {gameState.gameID}
        </>
    )
}

export default Player
