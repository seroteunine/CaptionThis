type Caption = {
    authorPlayerID: string,
    captionText: string
}

function VotingPlayer({captions, isOwnPhoto} : {captions: Caption[], isOwnPhoto: Boolean}) {

    return (
        <div>
            <h1>Voting phase</h1>
            {!captions && !isOwnPhoto ? 
            ( <h2>Loading...</h2> ) 
            :
            (
                <div>
                    {isOwnPhoto ? (
                        <h2>This is your photo. So you can not vote.</h2>
                    ) : (
                        <div>
                            <h2>Vote on your favourite caption:</h2>
                            {captions.map((caption) => (
                                <h3 key={caption.authorPlayerID}>{caption.captionText}</h3>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default VotingPlayer