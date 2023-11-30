import { useRoom } from "../context/RoomContext";
import { startGame } from "../service/SocketService";
import CaptionHost from "../components/host/CaptionHost";
import EndHost from "../components/host/EndHost";
import PhotoUploadHost from "../components/host/PhotoUploadHost";
import VotingHost from "../components/host/VotingHost";
import { useNameContext } from "../context/NamesContext";
import Settings from "../components/host/Settings";

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
        <>
            <Settings></Settings>

            <div className="container">
                <div className="bg-primary text-center text-white mb-2 p-3 shadow-sm rounded-bottom">
                    <h2 className="display-4">Roomcode: <span className="badge bg-secondary"><span className={roomDTO!.game ? 'text-primary' : "animate-character"}>{roomDTO!.roomID}</span></span></h2>
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
                    <div className="container mt-4 text-center">
                        <div title={isStartingDisallowed ? "You need 4 to 8 players and everyone needs to change their name." : "Ready to start."}>
                            <button
                                className='btn btn-lg btn-success text-white'
                                onClick={handleStartGame}
                                disabled={isStartingDisallowed}> Start game
                            </button>
                        </div>

                        <div className="w-25 mx-auto">
                            <ul className="list-group mt-3 ">
                                {roomDTO!.playerIDs.length > 0 && <li className="list-group-item active">Players:</li>}
                                {roomDTO!.playerIDs.map((ID) => (
                                    <li className={"list-group-item " + (nameMap.get(ID) ? " text-success" : " text-warning")} key={ID}>{nameMap.get(ID) || ID}</li>
                                ))}
                            </ul>
                        </div>

                    </div>
                }
            </div>
        </>
    )
}

export default Host
