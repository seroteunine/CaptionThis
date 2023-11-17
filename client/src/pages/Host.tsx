import { MouseEventHandler } from "react"
import PhotoUploadHost from "../components/host/PhotoUploadHost";

type GameDTO = {
    phase: string;
    playerNames: string[];
    photos: { [k: string]: ArrayBuffer };
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playersIDToName: { [k: string]: string };
    game: GameDTO | undefined
}

function Host({ roomDTO, startGame }: { roomDTO: RoomDTO, startGame: MouseEventHandler<HTMLButtonElement> }) {

    const isStartingDisallowed = Object.keys(roomDTO.playersIDToName).length < 3 || Object.keys(roomDTO.playersIDToName).length > 8;

    return (
        <>
            <h1>Room: {roomDTO.roomID} - You're the host {roomDTO.hostID}</h1>
            <h3>Players:</h3>
            {Object.entries(roomDTO.playersIDToName).map(([key, value]) => (
                <h3 key={key}>{value}</h3>
            ))}

            {roomDTO.game
                ?
                <PhotoUploadHost gameDTO={roomDTO.game}></PhotoUploadHost>
                :
                <button
                    className={`px-4 py-2 rounded font-bold text-white
                        ${isStartingDisallowed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                    onClick={startGame}
                    disabled={isStartingDisallowed}> Start game (you need 3 to 8 players) </button>
            }
        </>
    )
}

export default Host
