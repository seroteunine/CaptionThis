import { useEffect, useState } from 'react'
import { useWebSocket } from '../../context/socket';
import { useRoomCode } from '../../context/roomCode';

function WaitingRoomPlayer() {

    const socket = useWebSocket();

    const { roomCode } = useRoomCode();
    const [textInput, setTextInput] = useState('');

    useEffect(() => {
        socket?.emit('get-waitingroom-start');

        socket?.on('waitingroom-start', (data) => {

        })

        return () => {
            socket?.off('waitingroom-start');
        }
    }, [])

    const sendText = () => {
        socket?.emit('send-message', { roomCode: roomCode, textMessage: textInput });
    }

    return (
        <>
            <h1>WaitingRoom - Player</h1>
            <h2>{roomCode}</h2>
            <input type='text' value={textInput} onChange={(e) => setTextInput(e.target.value)}></input><button onClick={sendText}>Submit</button>
        </>
    )
}

export default WaitingRoomPlayer
