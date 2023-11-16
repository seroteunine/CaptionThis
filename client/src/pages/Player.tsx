type GameDTO = {
    phase: string;
    players: string[];
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playerIDs: string[],
    game: GameDTO | undefined
}

function Player({ roomDTO }: { roomDTO: RoomDTO }) {

    return (
        <>
            <h1>Room: {roomDTO.roomID} - You're a player</h1>

            {roomDTO.game ?
                <h2>Game is started. Phase: {roomDTO.game.phase}</h2>
                :
                <h2>Wait for game to start.</h2>
            }
        </>
    )
}

export default Player
