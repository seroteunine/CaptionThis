import ImageComponent from "./ImageComponent";

type GameDTO = {
    phase: string;
    players: string[];
    photos: ArrayBuffer[];
}

function PhotoUploadHost({ gameDTO }: { gameDTO: GameDTO }) {

    function nextPhase() {
        console.log('clicked: go to next phase');
    }

    return (
        <div>
            <h1>Photo uploading phase</h1>
            <button className="px-4 py-2 rounded font-bold bg-white" onClick={nextPhase}>Click to go to the next phase: Captioning</button>
            <h3>Photos</h3>
            {gameDTO.photos.map((photoArrayBuffer) => (
                <ImageComponent arrayBuffer={photoArrayBuffer}></ImageComponent>
            ))}
        </div>
    )
}

export default PhotoUploadHost