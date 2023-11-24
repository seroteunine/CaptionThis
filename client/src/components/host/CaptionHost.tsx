import NextPhaseButton from "./NextPhaseButton";

function CaptionHost() {

    return (
        <div>
            <h1>Captioning phase</h1>
            <NextPhaseButton nextPhase="Voting"></NextPhaseButton>
            <h3>Each player now has to caption the other photos. Only allowed to go to next phase if all photos have been captioned.</h3>
        </div>
    )
}

export default CaptionHost