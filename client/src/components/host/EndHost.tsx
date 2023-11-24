import { useEffect, useState } from "react";
import { emitDeleteGame, getScore } from "../../service/SocketService";
import socket from "../../socket";
import { useNameContext } from "../../context/NamesContext";

type ScoreDTO = Record<string, number>;

function EndHost() {

    const { nameMap } = useNameContext();
    const [finalScore, setFinalScore] = useState<Record<string, number>>();

    function handleRemoveGame() {
        emitDeleteGame();
    }

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
            <button onClick={handleRemoveGame} className="bg-white p-2 m-2">Delete game.</button>
            {!finalScore ?
                <h2>Score is loading...</h2>
                :
                <table>
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