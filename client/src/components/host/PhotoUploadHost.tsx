import { useImagesContext } from "../../context/ImagesContext";
import { useNameContext } from "../../context/NamesContext";
import ImageComponent from "./ImageComponentHost";

function PhotoUploadHost() {

    const { nameMap } = useNameContext();
    const { photos } = useImagesContext();

    return (
        <div className="photo-container">
            <h2>Photo uploading phase</h2>
            <div className="row">
                {Object.entries(photos).map(([ownerID, value]) => (
                    <div key={ownerID} className="col-3 m-3" title={nameMap.get(ownerID) || ownerID}>
                        <ImageComponent arrayBuffer={value}></ImageComponent>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PhotoUploadHost