import { useRoom } from "../../context/RoomContext";
import ImageComponent from "./ImageComponentHost";

function VotingHost() {

    const { roomDTO } = useRoom();
    const photos = Object.entries(roomDTO!.game!.photos);
    const votingRound = roomDTO!.game!.votingRound;

    const [currentPlayerID, currentPhotoArrayBuffer] = photos[votingRound - 1];
    const captions = roomDTO!.game!.captions.filter((caption) => caption.photoOwnerPlayerID === currentPlayerID);

    return (
        <div className="container">
            <h1 className="text-center">Voting phase</h1>
            <h4 className="text-center mb-4">Votes: {roomDTO!.game!.votes[votingRound].length}/{roomDTO!.game!.playerIDs.length}</h4>

        <div  className="d-flex flex-row">
            <div key={currentPlayerID} className="w-50 d-flex justify-content-end me-5">
                <ImageComponent arrayBuffer={currentPhotoArrayBuffer}></ImageComponent>

            </div>
            <div className="w-50 d-flex flex-column justify-content-start ms-5">
                {captions.map((caption, index) => (
                    <h2 
                        key={caption.ID} 
                        className="caption-enter" 
                        style={{ animationDelay: `${index * 1}s` }}
                    >
                        - {caption.captionText}
                    </h2>
                ))}
            </div>
        </div>
        </div>
    )
}

export default VotingHost