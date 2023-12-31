import { useNameContext } from "../../context/NamesContext";
import { useRoom } from "../../context/RoomContext";
import { removePlayer } from "../../service/SocketService";

function Settings() {

    const { roomDTO } = useRoom();
    const { nameMap } = useNameContext();

    const handleRemovePlayer = (playerID: string) => {
        removePlayer(playerID);
    }

    return (
        <div className="fixed-badge">
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle text-primary fs-3" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-sliders"></i>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><h6 className="dropdown-header">Remove player: </h6></li>
                    {roomDTO!.playerIDs.map((playerID) => (
                        <li key={playerID}><button className="dropdown-item  player-item" onClick={() => handleRemovePlayer(playerID)}>{nameMap.get(playerID) || playerID}</button></li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Settings;