import { useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import { sendCaption } from "../../service/SocketService";


function CaptionPlayer() {

    const { roomDTO } = useRoom();
    const playerID = sessionStorage.getItem('playerID')!;

    const [caption, setCaption] = useState('');

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLastPhoto, setIsLastPhoto] = useState(false);
    const photos = Object.entries(roomDTO!.game!.photos).filter(([key]) => playerID !== key);

    const [key, value] = photos[currentPhotoIndex];

    const nextPhoto = () => {
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        } else {
            setIsLastPhoto(true);
        }
    };

    const submitCaption = () => {
        sendCaption(caption, key);
        nextPhoto();
    }

    return (
        <div>
            <h1>Captioning phase</h1>

            {isLastPhoto ?
                <h2>Wait for the others to finish.</h2>
                :
                <div key={key}>
                    <input onChange={(e) => setCaption(e.target.value)} placeholder="Caption for this photo: "></input>
                    <button onClick={submitCaption}>Submit caption</button>
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                </div>
            }

        </div>
    )
}

export default CaptionPlayer