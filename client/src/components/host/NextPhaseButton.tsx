import { useRoom } from "../../context/RoomContext";
import { goNextPhase } from "../../service/SocketService"

function NextPhaseButton() {

    const { roomDTO } = useRoom();

    function handleNextPhase() {
        goNextPhase(roomDTO!.roomID)
    }

    return (
        <>
            <button className="px-4 py-2 rounded font-bold bg-white" onClick={handleNextPhase}>Click to go to the next phase: Captioning</button>
        </>
    )
}

export default NextPhaseButton