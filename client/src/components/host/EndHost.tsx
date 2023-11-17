import { useRoom } from "../../context/RoomContext";

function EndHost() {

    const { roomDTO } = useRoom();

    return (
        <div>
            <h1>End phase</h1>
        </div>
    )
}

export default EndHost