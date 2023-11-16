import { MouseEventHandler } from "react"

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

function Host({ roomDTO, startGame }: { roomDTO: RoomDTO, startGame: MouseEventHandler<HTMLButtonElement> }) {

    return (
        <>
            <h1>Room: {roomDTO.roomID} - You're the host {roomDTO.hostID}</h1>
            {roomDTO.game ? <h2>Game is started</h2> : <h2>Wait for the game to start</h2>}
            <button onClick={startGame}> Start game </button>
            <h3>Players:</h3>
            {roomDTO.playerIDs.map((player) => (
                <h3 key={player}>{player}</h3>
            ))}
        </>
    )
}

export default Host
