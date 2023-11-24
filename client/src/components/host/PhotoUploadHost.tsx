import { useNameContext } from "../../context/NamesContext";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";

function PhotoUploadHost() {

    const { roomDTO } = useRoom();
    const { nameMap } = useNameContext();

    return (
        <div>
            <h1>Photo uploading phase</h1>
            <h3>Photos</h3>
            {Object.entries(roomDTO!.game!.photos).map(([ownerID, value]) => (
                <div key={ownerID}>
                    <h4> {nameMap.get(ownerID) || ownerID} uploaded this photo: </h4>
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                </div>
            ))}
        </div>
    )
}

export default PhotoUploadHost