import { useRoom } from "../../context/RoomContext";

function EndPlayer() {

    const { roomDTO } = useRoom();

    const score = roomDTO!.game!.score[sessionStorage.getItem('playerID')!];

    return (
        <div>
            <h3>Your score was {score}</h3>
        </div>
    )
}

export default EndPlayer