import { useRoom } from "../../context/RoomContext";

function CaptionHost() {

    const { roomDTO } = useRoom();

    return (
        <div>
            <h1>Captioning phase</h1>
        </div>
    )
}

export default CaptionHost