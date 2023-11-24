import { sendVote } from "../../service/SocketService";

type Caption = {
    ID: number,
    authorPlayerID: string,
    captionText: string
}

function VotingPlayer({ captions, hasVoted, setHasVoted }: { captions: Caption[], hasVoted: Boolean, setHasVoted: React.Dispatch<React.SetStateAction<boolean>> }) {

    const handleVote = (ID: number) => {
        console.log('voted on :', ID);
        sendVote(ID);
        setHasVoted(true);
    };


    return (
        <div>
            <h1>Voting phase</h1>

            {!captions ?
                (<h2>Loading...</h2>)
                :
                (
                    <div>
                        {hasVoted ?
                            <h2>You have placed your vote.</h2>
                            :
                            <div>
                                <h2>Vote on your favourite caption:</h2>
                                {captions.map((caption) => (
                                    <button onClick={() => handleVote(caption.ID)} className="bg-white p-2 m-2" key={caption.ID}>{caption.captionText}</button>
                                ))}
                            </div >
                        }</div>
                )}

        </div >
    )
}

export default VotingPlayer