import { useRoom } from "../context/RoomContext";
import { startGame } from "../service/SocketService";
import CaptionHost from "../components/host/CaptionHost";
import EndHost from "../components/host/EndHost";
import PhotoUploadHost from "../components/host/PhotoUploadHost";
import VotingHost from "../components/host/VotingHost";

function Host() {

    const { roomDTO } = useRoom();

    const isStartingDisallowed = Object.keys(roomDTO!.playersIDToName).length < 4 || Object.keys(roomDTO!.playersIDToName).length > 8;

    function handleStartGame() {
        if (roomDTO) {
            startGame(roomDTO.roomID);
        }
    }

    return (
        <>
            <h1>Room: {roomDTO!.roomID} - You're the host {roomDTO!.hostID}</h1>
            <h3>Players:</h3>
            {Object.entries(roomDTO!.playersIDToName).map(([key, value]) => (
                <h3 key={key}>{value}</h3>
            ))}

            {roomDTO!.game
                ?
                <div>
                    {{
                        "PHOTO_UPLOAD": <PhotoUploadHost></PhotoUploadHost>,
                        "CAPTION": <CaptionHost></CaptionHost>,
                        "VOTING": <VotingHost></VotingHost>,
                        "END": <EndHost></EndHost>
                    }[roomDTO!.game.phase]}
                </div>
                :
                <button
                    className={`px-4 py-2 rounded font-bold text-white
                        ${isStartingDisallowed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                    onClick={handleStartGame}
                    disabled={isStartingDisallowed}> Start game (you need 4 to 8 players) </button>
            }
        </>
    )
}

export default Host
