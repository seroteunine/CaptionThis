import { sendAnotherRound } from "../../service/SocketService";
import { useNameContext } from "../../context/NamesContext";
import { useRoom } from "../../context/RoomContext";

function EndHost() {

    const { roomDTO } = useRoom();
    const { nameMap } = useNameContext();
    const finalScore = roomDTO!.game!.score;

    const handleAnotherRound = () => {
        sendAnotherRound();
    }

    return (
        <div className="container">
            {!finalScore ?
                <h2>Score is loading...</h2>
                :
                <div className="container text-center">
                    <table className="container table table-bordered w-50 mb-5">
                        <thead className="table-success">
                            <tr>
                                <th>Player</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(finalScore).sort((a, b) => b[1] - a[1]).map(([playerID, score], index, array) => {
                                const reverseIndex = array.length - 1 - index;
                                return (
                                    <tr key={playerID}>
                                        <td>
                                            <span className="caption-enter" style={{ animationDelay: `${reverseIndex * 1}s` }}>
                                                {nameMap.get(playerID) || playerID}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="caption-enter" style={{ animationDelay: `${reverseIndex * 1}s` }}>
                                                {score}
                                            </span>
                                        </td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>

                    <button onClick={handleAnotherRound} className="btn btn-success">Play another round</button>
                </div>
            }
        </div>
    )
}

export default EndHost