import { useEffect, useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import NextPhaseButton from "./NextPhaseButton";
import socket from "../../socket";
import { sendNextPhotoRequest } from "../../service/SocketService";

type CaptionedPhotoDTO = {
    owner: string,
    captions: {authorPlayerID:string, captionText:string}[]
}

function VotingHost() {

    const {roomDTO} = useRoom();
    const photos = roomDTO!.game!.photos;

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLastPhoto, setIsLastPhoto] = useState(false);
    const [captionedPhoto, setCaptionedPhoto] = useState<CaptionedPhotoDTO>();

    useEffect(() => {

        socket.on('host:captioned-photo', (captioned) => {
            console.log(captioned);
            setCaptionedPhoto(captioned);
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        })

        return () => {
            socket.off('host:captioned-photo');
        }

    }, []);

    const askNextPhoto = () => {
        sendNextPhotoRequest(currentPhotoIndex);
    }

    return (
        <div>
            <h1>Voting phase</h1>

            {isLastPhoto 
                ?
                <NextPhaseButton nextPhase="End"></NextPhaseButton>
                :
                captionedPhoto 
                    ?
                        <div key={captionedPhoto!.owner}>
                            <ImageComponent arrayBuffer={photos[captionedPhoto!.owner]}></ImageComponent>
                            <button className="bg-white" onClick={askNextPhoto}>Next photo</button>
                        </div>
                    :
                        <button onClick={askNextPhoto}>Start voting round.</button>
            }
        </div>
    )
}

export default VotingHost