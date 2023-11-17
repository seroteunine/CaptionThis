import { useRoom } from "../../context/RoomContext";
import { goNextPhase } from "../../service/SocketService";
import ImageComponent from "./ImageComponent";
import NextPhaseButton from "./NextPhaseButton";

function PhotoUploadHost() {

    const { roomDTO } = useRoom();

    return (
        <div>
            <h1>Photo uploading phase</h1>
            <NextPhaseButton></NextPhaseButton>
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