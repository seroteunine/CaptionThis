import { useEffect, useState } from "react";
import { sendName } from "../service/SocketService";
import { useRoom } from "../context/RoomContext";

import PhotoUploadPlayer from "../components/player/PhotoUploadPlayer";
import CaptionPlayer from "../components/player/CaptionPlayer";
import VotingPlayer from "../components/player/VotingPlayer";
import EndPlayer from "../components/player/EndPlayer";
import socket from "../socket";

type Caption = {
    ID: number,
    authorPlayerID: string,
    captionText: string
}

type CaptionedPhotoDTO = {
    owner: string,
    captions: Caption[]
}

function Player() {

    const { roomDTO } = useRoom();

    const [username, setUsername] = useState('');

    function setValue(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }

    function handleSendName() {
        sendName(username);
    }


    const [captions, setCaptions] = useState<Caption[]>();
    const [photoRound, setPhotoRound] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        socket.on('player:captioned-photo', (captionDTO: CaptionedPhotoDTO) => {
            setCaptions(captionDTO.captions);
            setPhotoRound((prevRound) => prevRound + 1);
            setHasVoted(false);
        })

        return () => {
            socket.off('player:captioned-photo');
        }

    }, [])

    return (
        <>
            <h1>Room: {roomDTO!.roomID} - You're a player</h1>

            {roomDTO!.game ?
                <div>
                    {{
                        "PHOTO_UPLOAD": <PhotoUploadPlayer></PhotoUploadPlayer>,
                        "CAPTION": <CaptionPlayer></CaptionPlayer>,
                        "VOTING": <VotingPlayer captions={captions!} photoRound={photoRound} hasVoted={hasVoted} setHasVoted={setHasVoted}></VotingPlayer>,
                        "END": <EndPlayer></EndPlayer>
                    }[roomDTO!.game.phase]}
                </div>
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
