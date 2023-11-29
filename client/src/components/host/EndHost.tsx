import { useEffect, useState } from "react";
import { getScore } from "../../service/SocketService";
import socket from "../../socket";
import { useNameContext } from "../../context/NamesContext";

type ScoreDTO = Record<string, number>;

function EndHost() {

    const { nameMap } = useNameContext();
    const [finalScore, setFinalScore] = useState<Record<string, number>>();

    useEffect(() => {
        socket.on('host:score', (scoreDTO: ScoreDTO) => {
            setFinalScore(scoreDTO);
        })

        getScore();

        return () => {
            socket.off('host:score');
        }
    }, [])

    return (
        <div>
            <h1>End phase</h1>
            {!finalScore ?
                <h2>Score is loading...</h2>
                :
                <table className="container table table-bordered w-50">
                    <thead className="table-success">
                        <tr>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(finalScore).sort((a, b) => b[1] - a[1]).map(([playerID, score]) => (
                            <tr key={playerID}>
                                <td>{nameMap.get(playerID) || playerID}</td>
                                <td>{score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default EndHost