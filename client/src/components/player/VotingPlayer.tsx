import { sendVote } from "../../service/SocketService";

type Caption = {
    ID: number,
    captionText: string
}

function VotingPlayer({ captions }: { captions: Caption[] }) {

    const handleVote = (ID: number) => {
        console.log('voted on :', ID);
        sendVote(ID);
    };

    return (
        <div>
            <h1>Voting phase</h1>

            {!captions ?
                (<h2>Loading...</h2>)
                :
                (
                    <div>
                        <h2>Vote on your favourite caption:</h2>
                        {captions.map((caption) => (
                            <button onClick={() => handleVote(caption.ID)} className="bg-white p-2 m-2" key={caption.ID}>{caption.captionText}</button>
                        ))}
                    </div>
                )}

        </div>
    )
}

export default VotingPlayer