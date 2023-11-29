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

    function handleSendName(e: React.FormEvent) {
        e.preventDefault();
        sendName(username);
        setUsername('');
    }

    return (
        <>
            <div className="bg-primary text-white text-center p-3 shadow-sm">
                <h2 className="">Roomcode: <span className="badge bg-success">{roomDTO!.roomID}</span></h2>
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
                <div className="container mt-4 text-center w-md-50">
                    <h4>Wait for game to start.</h4>
                    <form onSubmit={handleSendName} className="d-flex">
                        <input className="form-control me-2" type="text" placeholder="New name" onChange={(e) => setValue(e)} value={username} autoFocus></input>
                        <button type="submit" className="btn btn-primary" disabled={!username.trim()}>Change</button>
                    </form>
                </div>
            }
        </>
    )
}

export default Player
