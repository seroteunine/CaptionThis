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

    const isStartingDisallowed = roomDTO.playerIDs.length < 3 || roomDTO.playerIDs.length > 8;

    return (
        <>
            <h1>Room: {roomDTO.roomID} - You're the host {roomDTO.hostID}</h1>
            <h3>Players:</h3>
            {roomDTO.playerIDs.map((player) => (
                <h3 key={player}>{player}</h3>))
            }

            {roomDTO.game
                ?
                <h2>Game is started and in phase: {roomDTO.game.phase}</h2>
                :
                <button
                    className={`px-4 py-2 rounded font-bold text-white
                        ${isStartingDisallowed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                    onClick={startGame}
                    disabled={isStartingDisallowed}> Start game </button>
            }
        </>
    )
}

export default Host
