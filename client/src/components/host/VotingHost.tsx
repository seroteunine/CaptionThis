import { useRoom } from "../../context/RoomContext";

function VotingHost() {

    const { roomDTO } = useRoom();

    return (
        <div>
            <h1>Voting phase</h1>
        </div>
    )
}

export default VotingHost