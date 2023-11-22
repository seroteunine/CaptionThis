import { sendVote } from "../../service/SocketService";

type Caption = {
    authorPlayerID: string,
    captionText: string
}

function VotingPlayer({captions} : {captions: Caption[]}) {

    const handleVote = (authorPlayerID: string) => {
        console.log('voted on :', authorPlayerID);
        sendVote(authorPlayerID);
    };

    return (
        <div>
            <h1>Voting phase</h1>

            {!captions? 
                ( <h2>Loading...</h2> ) 
                :
                (
                <div>
                    <h2>Vote on your favourite caption:</h2>
                    {captions.map((caption) => (
                        <button onClick={() => handleVote(caption.authorPlayerID)} className="bg-white p-2 m-2" key={caption.authorPlayerID}>{caption.captionText}</button>
                    ))}
                </div>
            )}

        </div>
    )
}

export default VotingPlayer