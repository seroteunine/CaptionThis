import { useState } from "react";
import PhotoUploadPlayer from "../components/player/PhotoUploadPlayer";
import socket from "../socket";

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

function Player({ roomDTO }: { roomDTO: RoomDTO }) {

    const [username, setUsername] = useState('');

    function setValue(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function sendName() {
        socket.emit('player:set-name', username);
    }

    return (
        <>
            <h1>Room: {roomDTO.roomID} - You're a player</h1>

            {roomDTO.game ?
                <PhotoUploadPlayer></PhotoUploadPlayer>
                :
                <div>
                    <h2>Wait for game to start.</h2>
                    <input type="text" placeholder="New name" onChange={(e) => setValue(e)}></input><button onClick={sendName}>Change name</button>
                </div>
            }
        </>
    )
}

export default Player
