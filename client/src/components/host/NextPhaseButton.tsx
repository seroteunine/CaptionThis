import { goNextPhase } from "../../service/SocketService"

function NextPhaseButton({ nextPhase }: { nextPhase: string }) {

    function handleNextPhase() {
        goNextPhase()
    }

    return (
        <>
            <button className="px-4 py-2 rounded font-bold bg-white" onClick={handleNextPhase}>Click to go to the next phase: {nextPhase}</button>
        </>
    )
}

export default NextPhaseButton