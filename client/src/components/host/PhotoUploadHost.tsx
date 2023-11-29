import { useNameContext } from "../../context/NamesContext";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";

function PhotoUploadHost() {

    const { roomDTO } = useRoom();
    const { nameMap } = useNameContext();

    return (
        <div>
            <h2>Photo uploading phase</h2>
            <div className="photo-grid">
            {Object.entries(roomDTO!.game!.photos).map(([ownerID, value]) => (
                <div key={ownerID} className="photo-container" title={nameMap.get(ownerID) || ownerID}>
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                </div>
            ))}
            </div>
        </div>
    )
}

export default PhotoUploadHost