import { useRoom } from "../../context/RoomContext";
import ImageComponent from "../ImageComponent";
import NextPhaseButton from "./NextPhaseButton";

function VotingHost() {

    const { roomDTO } = useRoom();

    return (
        <div>
            <h1>Voting phase</h1>
            <NextPhaseButton nextPhase="End"></NextPhaseButton>
            {Object.entries(roomDTO!.game!.captions).map(([photoOwner, captions]) => (
                <div key={photoOwner}>
                    <ImageComponent arrayBuffer={roomDTO!.game!.photos[photoOwner]}></ImageComponent>
                    <ul>
                        {Object.entries(captions).map(([author, caption]) => (
                            <li key={author}>
                                <strong>{author}:</strong> {caption}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default VotingHost