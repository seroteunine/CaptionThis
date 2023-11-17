import { useRoom } from "../../context/RoomContext";
import ImageComponent from "./ImageComponent";

function PhotoUploadHost() {

    const { roomDTO } = useRoom();

    function nextPhase() {
        console.log('clicked: go to next phase');
    }

    return (
        <div>
            <h1>Photo uploading phase</h1>
            <button className="px-4 py-2 rounded font-bold bg-white" onClick={nextPhase}>Click to go to the next phase: Captioning</button>
            <h3>Photos</h3>
            {Object.entries(roomDTO!.game!.photos).map(([key, value]) => (
                <div key={key}>
                    <h4> {key} uploaded this photo: </h4>
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                </div>
            ))}
        </div>
    )
}

export default PhotoUploadHost