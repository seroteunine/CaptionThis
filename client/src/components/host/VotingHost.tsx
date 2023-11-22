import { useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import NextPhaseButton from "./NextPhaseButton";

function VotingHost() {

    const { roomDTO } = useRoom();
    const photos = Object.entries(roomDTO!.game!.photos);

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLastPhoto, setIsLastPhoto] = useState(false);

    const [ownerOfPhoto, photoData] = photos[currentPhotoIndex];
    const captions = roomDTO!.game!.captions.filter((caption) => caption.ownerPlayerID === ownerOfPhoto);

    const handleNextPhoto = () => {
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        } else {
            setIsLastPhoto(true);
        }
    }

    return (
        <div>
            <h1>Voting phase</h1>

            {isLastPhoto 
                ?
                <NextPhaseButton nextPhase="End"></NextPhaseButton>
                :  
                <div key={ownerOfPhoto}>
                    <ImageComponent arrayBuffer={photoData}></ImageComponent>
                    {captions.map((caption) => (
                        <h3 key={caption.authorPlayerID}>{caption.captionText}</h3>
                    ))}
                    <button className="bg-white" onClick={handleNextPhoto}>Next photo</button>
                </div>
            }
        </div>
    )
}

export default VotingHost