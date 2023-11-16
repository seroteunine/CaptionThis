import ImageComponent from "./ImageComponent";

type GameDTO = {
    phase: string;
    players: string[];
    photos: ArrayBuffer[];
}

function PhotoUploadHost({ gameDTO }: { gameDTO: GameDTO }) {

    return (
        <div>
            <h1>Photo uploading phase</h1>
            {gameDTO.photos.map((photoArrayBuffer) => (
                <ImageComponent arrayBuffer={photoArrayBuffer}></ImageComponent>
            ))}
        </div>
    )
}

export default PhotoUploadHost