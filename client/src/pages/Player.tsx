import { useState } from "react";
import { sendName } from "../service/SocketService";
import { useRoom } from "../context/RoomContext";

import PhotoUploadPlayer from "../components/player/PhotoUploadPlayer";
import CaptionPlayer from "../components/player/CaptionPlayer";
import VotingPlayer from "../components/player/VotingPlayer";
import EndPlayer from "../components/player/EndPlayer";

function Player() {

    const { roomDTO } = useRoom();

    const [username, setUsername] = useState('');

    function setValue(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function handleSendName() {
        sendName(username);
    }

    return (
        <>
            <div className="text-center p-3 shadow-sm">
                <h2 className="">Roomcode: <span className="badge badge-secondary">{roomDTO!.roomID}</span></h2>
                <h4>You're a player</h4>
            </div>

            {roomDTO!.game ?
                <div className="container mt-4">
                    {{
                        "PHOTO_UPLOAD": <PhotoUploadPlayer></PhotoUploadPlayer>,
                        "CAPTION": <CaptionPlayer></CaptionPlayer>,
                        "VOTING": <VotingPlayer></VotingPlayer>,
                        "END": <EndPlayer></EndPlayer>
                    }[roomDTO!.game.phase]}
                </div>
                :
                <div className="container mt-4 text-center">
                    <h4>Wait for game to start.</h4>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <input className="form-control me-2" type="text" placeholder="New name" onChange={(e) => setValue(e)}></input>
                        <button className="btn btn-primary" onClick={handleSendName} disabled={!username.trim()}>Change</button>
                    </div>
                </div>
            }
        </>
    )
}

export default Player
