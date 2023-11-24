import { useCallback, useEffect, useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import socket from "../../socket";
import { sendNextPhotoRequest } from "../../service/SocketService";

type CaptionedPhotoDTO = {
    owner: string,
    captions: { ID: number, captionText: string }[]
}

function VotingHost() {

    const { roomDTO } = useRoom();
    const photos = roomDTO!.game!.photos;

    const [captionedPhoto, setCaptionedPhoto] = useState<CaptionedPhotoDTO>();

    useEffect(() => {
        socket.on('host:captioned-photo', handleCaptionedPhoto);

        askNextPhoto();

        return () => {
            socket.off('host:captioned-photo', handleCaptionedPhoto);
        }
    }, []);

    const handleCaptionedPhoto = useCallback((captionedPhoto: CaptionedPhotoDTO) => {
        setCaptionedPhoto(captionedPhoto);
    }, [photos]);

    const askNextPhoto = () => {
        sendNextPhotoRequest();
    }

    return (
        <div>
            <h1>Voting phase</h1>

            {captionedPhoto ? (
                <div key={captionedPhoto.owner}>
                    <ImageComponent arrayBuffer={photos[captionedPhoto.owner]}></ImageComponent>

                    {captionedPhoto.captions.map((caption) => (
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