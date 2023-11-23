import { useCallback, useEffect, useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import NextPhaseButton from "./NextPhaseButton";
import socket from "../../socket";
import { sendNextPhotoRequest } from "../../service/SocketService";

type CaptionedPhotoDTO = {
    owner: string,
    captions: { ID: number, captionText: string }[]
}

function VotingHost() {

    const { roomDTO } = useRoom();
    const photos = roomDTO!.game!.photos;

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const isLastPhoto = (currentPhotoIndex === Object.keys(photos).length);

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
        setCurrentPhotoIndex((prevIndex) => prevIndex + 1);
    }, [photos]);

    const askNextPhoto = () => {
        sendNextPhotoRequest(currentPhotoIndex);
    }

    return (
        <div>
            <h1>Voting phase</h1>

            {captionedPhoto ? (
                <div key={captionedPhoto.owner}>
                    <ImageComponent arrayBuffer={photos[captionedPhoto.owner]}></ImageComponent>

                    {captionedPhoto.captions.map((caption) => (
                        <h2 key={caption.captionText}>{caption.captionText}</h2>
                    ))}

                    {isLastPhoto ?
                        <NextPhaseButton nextPhase="End"></NextPhaseButton>
                        :
                        <button className="bg-white" onClick={askNextPhoto}>Next photo</button>
                    }
                </div>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    )
}

export default VotingHost