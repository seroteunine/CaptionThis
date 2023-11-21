import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";

function CaptionPlayer() {

    const { roomDTO } = useRoom();

    return (
        <div>
            <h1>Captioning phase</h1>
            {Object.entries(roomDTO!.game!.photos).map(([key, value]) => (
                <div key={key}>
                    <input placeholder="Caption for this photo: "></input><button>Submit caption</button>
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                </div>
            ))}
        </div>
    )
}

export default CaptionPlayer