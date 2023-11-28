import { useEffect, useState } from "react";
import { useRoom } from "../../context/RoomContext";
import { sendVote } from "../../service/SocketService";
import socket from "../../socket";

function VotingPlayer() {

    const { roomDTO } = useRoom();
    const ownPlayerID = sessionStorage.getItem('playerID');
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = (ID: number) => {
        console.log('voted on :', ID);
        sendVote(ID);
    };

    const photos = Object.entries(roomDTO!.game!.photos);
    const votingRound = roomDTO!.game!.votingRound;

    const [playerID] = photos[votingRound - 1];
    const captions = roomDTO!.game!.captions.filter((caption) => caption.photoOwnerPlayerID === playerID && caption.authorPlayerID != ownPlayerID);

    useEffect(() => {
        socket.on('player:received-vote', () => {
            setHasVoted(true);
        });

        return () => {
            socket.off('player:received-vote');
        }
    })

    useEffect(() => {
        setHasVoted(false);
    }, [votingRound]); //To reset hasvoted when the next voting round happens.

    return (
        <div>
            <h1>Voting phase</h1>

            {hasVoted ?
                <h2>You have voted succesfully.</h2>
                :
                <div>
                    <h2>Vote on your favourite caption:</h2>
                    {captions.map((caption) => (
                        <button onClick={() => handleVote(caption.ID)} className="bg-white p-2 m-2" key={caption.ID}>{caption.captionText}</button>
                    ))}
                </div >
            }

        </div >
    )
}

export default VotingPlayer