import { useNameContext } from "../../context/NamesContext";
import { useRoom } from "../../context/RoomContext"

function CaptionHost() {

    const { roomDTO } = useRoom();
    const { nameMap } = useNameContext();

    const captionCount: Record<string, number> = {};
    roomDTO!.game!.playerIDs.forEach(playerID => {
        captionCount[playerID] = 0;
    });

    roomDTO!.game!.captions.forEach(caption => {
        if (caption.authorPlayerID in captionCount) {
            captionCount[caption.authorPlayerID]++;
        }
    });

    return (
        <div className="container text-center">
            <div className="container mb-4">
                <h1>Captioning phase</h1>
                <h4>Each player now has to caption the other photos.</h4>
            </div>
            <div>
                {Object.entries(captionCount).map(([playerID, count]) => (
                    <h4 key={playerID}>{nameMap.get(playerID) || playerID}: {(count < roomDTO!.game!.playerIDs.length - 1) ? 'Still captioning..' : 'Done'}</h4>
                ))}
            </div>
        </div>
    )
}

export default CaptionHost