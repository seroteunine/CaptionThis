import { useState } from "react";
import PhotoUploadPlayer from "../components/player/PhotoUploadPlayer";
import * as SocketService from "../service/SocketService";
import { useRoom } from "../context/RoomContext";

function Player() {

    const { roomDTO } = useRoom();

    const [username, setUsername] = useState('');

    function setValue(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function handleSendName() {
        SocketService.sendName(username);
    }

    return (
        <>
            <h1>Room: {roomDTO!.roomID} - You're a player</h1>

            {roomDTO!.game ?
                <PhotoUploadPlayer></PhotoUploadPlayer>
                :
                <div>
                    <h2>Wait for game to start.</h2>
                    <input type="text" placeholder="New name" onChange={(e) => setValue(e)}></input><button onClick={handleSendName}>Change name</button>
                </div>
            }
        </>
    )
}

export default Player
