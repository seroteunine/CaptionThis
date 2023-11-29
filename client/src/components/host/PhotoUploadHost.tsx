import { useNameContext } from "../../context/NamesContext";
import { useRoom } from "../../context/RoomContext";
import ImageComponent from "./ImageComponentHost";

function PhotoUploadHost() {

    const { roomDTO } = useRoom();
    const { nameMap } = useNameContext();

    return (
        <div className="photo-container">
            <h2>Photo uploading phase</h2>
            <div className="row">
            {Object.entries(roomDTO!.game!.photos).map(([ownerID, value]) => (
                <div key={ownerID} className="col-3 m-3" title={nameMap.get(ownerID) || ownerID}>
                    <ImageComponent arrayBuffer={value}></ImageComponent>
                </div>
            ))}
            </div>
        </div>
    )
}

export default PhotoUploadHost