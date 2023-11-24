import { useRoom } from "../context/RoomContext";
import { startGame } from "../service/SocketService";
import CaptionHost from "../components/host/CaptionHost";
import EndHost from "../components/host/EndHost";
import PhotoUploadHost from "../components/host/PhotoUploadHost";
import VotingHost from "../components/host/VotingHost";
import { useNameContext } from "../context/NamesContext";

function Host() {

    const { roomDTO } = useRoom();
    const { nameMap } = useNameContext();

    const isStartingDisallowed = roomDTO!.playerIDs.length < 4 || roomDTO!.playerIDs.length > 8;

    function handleStartGame() {
        if (roomDTO) {
            startGame();
        }
    }

    return (
        <>
            <h1>Room: {roomDTO!.roomID} - You're the host</h1>
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
                <div>
                    <h3>Players:</h3>
                    {roomDTO!.playerIDs.map((ID) => (
                        <h3 key={ID}>{nameMap.get(ID) || ID}</h3>
                    ))}
                    <button
                        className={`px-4 py-2 rounded font-bold text-white
                        ${isStartingDisallowed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                        onClick={handleStartGame}
                        disabled={isStartingDisallowed}> Start game (you need 4 to 8 players)
                    </button>
                </div>
            }
        </>
    )
}

export default Host
