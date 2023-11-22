type Caption = {
    authorPlayerID: string,
    captionText: string
}

function VotingPlayer({captions, isOwnPhoto} : {captions: Caption[], isOwnPhoto: Boolean}) {

    const handleVote = (authorOfCaptionPlayerID: string) => {
        console.log('voted on :', authorOfCaptionPlayerID);
    };

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
                                <button onClick={() => handleVote(caption.authorPlayerID)} className="bg-white p-2 m-2" key={caption.authorPlayerID}>{caption.captionText}</button>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default VotingPlayer