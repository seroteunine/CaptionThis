import { useImagesContext } from "../../context/ImagesContext";
import { useRoom } from "../../context/RoomContext";
import { sendVote } from "../../service/SocketService";


function VotingPlayer() {

    const { roomDTO } = useRoom();
    const { photos } = useImagesContext();
    const ownPlayerID = sessionStorage.getItem('playerID');
    const votingRound = roomDTO!.game!.votingRound;

    const handleVote = (ID: number) => {
        console.log('voted on :', ID);
        sendVote(ID);
    };

    const [playerID] = Object.entries(photos)[votingRound - 1];

    const captions = roomDTO!.game!.captions.filter((caption) => caption.photoOwnerPlayerID === playerID && caption.authorPlayerID != ownPlayerID);

    const hasVoted = roomDTO!.game!.votes[votingRound].some((vote) => vote.playerID === ownPlayerID)

    return (
        <div>
            <h1>Voting phase</h1>

            {hasVoted ?
                <h2>You have voted succesfully.</h2>
                :
                <div className="d-flex flex-column">
                    <h4>Vote on your favourite caption:</h4>
                    {captions.map((caption) => (
                        <button onClick={() => handleVote(caption.ID)} className="bg-white p-2 m-2" key={caption.ID}>{caption.captionText}</button>
                    ))}
                </div >
            }

        </div >
    )
}

export default VotingPlayer