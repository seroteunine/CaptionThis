import { useEffect, useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import socket from "../../socket";
import { sendFirstPhotoRequest } from "../../service/SocketService";

type captionsForVotingDTO = {
    owner: string,
    captions: { ID: number, captionText: string }[]
}

function VotingHost() {

    const { roomDTO } = useRoom();
    const photos = roomDTO!.game!.photos;

    const [captionsForVoting, setCaptionsForVoting] = useState<captionsForVotingDTO>();

    useEffect(() => {
        socket.on('host:captions-for-voting', (captionsForVotingDTO) => {
            setCaptionsForVoting(captionsForVotingDTO);
        });

        sendFirstPhotoRequest();

        return () => {
            socket.off('host:captions-for-voting');
        }
    }, []);

    return (
        <div>
            <h1>Voting phase</h1>

            {captionsForVoting ? (
                <div key={captionsForVoting.owner}>
                    <ImageComponent arrayBuffer={photos[captionsForVoting.owner]}></ImageComponent>

                    {captionsForVoting.captions.map((caption) => (
                        <h2 key={caption.ID}>{caption.captionText}</h2>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    )
}

export default VotingHost