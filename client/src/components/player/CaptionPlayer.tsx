import { useState } from "react";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../player/ImageComponentPlayer";
import { sendCaption } from "../../service/SocketService";


function CaptionPlayer() {

    const { roomDTO } = useRoom();
    const playerID = sessionStorage.getItem('playerID')!;

    const [caption, setCaption] = useState('');

    const captionCountOfThisPlayer = roomDTO!.game?.captions.filter(caption => caption.authorPlayerID === playerID).length || 0;
    const currentPhotoIndex = captionCountOfThisPlayer;

    const photos = Object.entries(roomDTO!.game!.photos).filter(([key]) => playerID !== key);
    const [key, value] = photos[currentPhotoIndex] || [undefined, undefined];

    const submitCaption = (e: React.FormEvent) => {
        e.preventDefault();
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
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                    <form onSubmit={submitCaption} className="container d-flex">
                        <input className="form-control m-2" onChange={(e) => setCaption(e.target.value)} placeholder="Caption for this photo" autoFocus></input>
                        <button type='submit' className="btn btn-success m-2" disabled={!caption.trim()}>Submit</button>
                    </form>
                </div>
            }

        </div>
    )
}

export default CaptionPlayer