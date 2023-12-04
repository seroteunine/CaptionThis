type Phase = "WAITING" | "PHOTO_UPLOAD" | "CAPTION" | "VOTING" | "END";

function Instructions({ phase }: { phase: Phase }) {

    const instructions = {
        'WAITING': 'Enter a name and wait for the game to start.',
        "PHOTO_UPLOAD": "Choose a picture from your gallery. Other players will caption this photo.",
        'CAPTION': 'Enter a funny caption for each photo.',
        "VOTING": "Vote on your favourite caption! The author of that caption will get points.",
        "END": "The game is over. You can see the scores on the main screen. Want to play another round?"
    };

    return (
        <div className="fixed-question">
            <p>
                <a className="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                    <i className="bi bi-question-circle"></i>
                </a>
            </p>
            <div className="collapse" id="collapseExample">
                <div className="card card-body">
                    {instructions[phase]}
                </div>
            </div>
        </div>
    )
}

export default Instructions;