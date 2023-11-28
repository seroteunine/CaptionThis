import { useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import { sendCaption } from "../../service/SocketService";


function CaptionPlayer() {

    const { roomDTO } = useRoom();
    const playerID = sessionStorage.getItem('playerID')!;

    const [caption, setCaption] = useState('');

    const captionCountOfThisPlayer = roomDTO!.game?.captions.filter(caption => caption.authorPlayerID === playerID).length || 0;
    const currentPhotoIndex = captionCountOfThisPlayer;

    const photos = Object.entries(roomDTO!.game!.photos).filter(([key]) => playerID !== key);
    const [key, value] = photos[currentPhotoIndex] || [undefined, undefined];

    const submitCaption = () => {
        if (caption.trim()) {
            sendCaption(caption, key);
        }
    }

    return (
        <div>
            <h1>Captioning phase</h1>

            {(captionCountOfThisPlayer === photos.length) ?
                <h2>Wait for the others to finish.</h2>
                :
                <div key={key}>
                    <input onChange={(e) => setCaption(e.target.value)} placeholder="Caption for this photo: "></input>
                    <button onClick={submitCaption} disabled={!caption.trim()}>Submit caption</button>
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                </div>
            }

        </div>
    )
}

export default CaptionPlayer