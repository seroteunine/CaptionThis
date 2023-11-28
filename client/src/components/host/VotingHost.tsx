import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";

function VotingHost() {

    const { roomDTO } = useRoom();
    const photos = Object.entries(roomDTO!.game!.photos);
    const votingRound = roomDTO!.game!.votingRound;

    const [currentPlayerID, currentPhotoArrayBuffer] = photos[votingRound - 1];
    const captions = roomDTO!.game!.captions.filter((caption) => caption.photoOwnerPlayerID === currentPlayerID);

    return (
        <div>
            <h1>Voting phase</h1>

            <div key={currentPlayerID}>
                <ImageComponent arrayBuffer={currentPhotoArrayBuffer}></ImageComponent>

                {captions.map((caption) => (
                    <h2 key={caption.ID}>{caption.captionText}</h2>
                ))}
            </div>

        </div>
    )
}

export default VotingHost