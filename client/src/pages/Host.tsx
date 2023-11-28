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
    const playerAmount = roomDTO!.playerIDs.length

    const isStartingDisallowed = playerAmount < 4 || playerAmount > 8 || (nameMap.size != playerAmount);

    function handleStartGame() {
        if (roomDTO) {
            startGame();
        }
    }

    return (
        <div className="container">
            <div className="text-center mb-2 p-3 shadow-sm">
                <h2 className="display-4">Roomcode: <span className="badge badge-dark">{roomDTO!.roomID}</span></h2>
                <h4>You're the host</h4>
            </div>
            {roomDTO!.game
                ?
                <div className="container mt-4">
                    {{
                        "PHOTO_UPLOAD": <PhotoUploadHost></PhotoUploadHost>,
                        "CAPTION": <CaptionHost></CaptionHost>,
                        "VOTING": <VotingHost></VotingHost>,
                        "END": <EndHost></EndHost>
                    }[roomDTO!.game.phase]}
                </div>
                :
                <div className="container mt-4 text-center ">
                    <div>
                        <button
                            className='btn btn-primary'
                            onClick={handleStartGame}
                            disabled={isStartingDisallowed}> Start game
                        </button>
                        {isStartingDisallowed && <p> (to start you need 4 to 8 players and everyone needs to change their name.) </p>}
                    </div>

                    <div className="w-50 mx-auto">
                        <ul className="list-group mt-3 ">
                            <li className="list-group-item active">Players:</li>
                            {roomDTO!.playerIDs.map((ID) => (
                                <li className="list-group-item" key={ID}>{nameMap.get(ID) || ID}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            }
        </div>
    )
}

export default Host
