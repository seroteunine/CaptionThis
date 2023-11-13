import { MouseEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/socket';
import { useRoomCode } from '../context/roomCode';

function Home() {
    const socket = useWebSocket();
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const { setRoomCode } = useRoomCode();

    let navigate = useNavigate();
    const [error, setError] = useState(false);

    const createRoom: MouseEventHandler<HTMLButtonElement> = () => {
        socket?.emit('create-room')
    }

    const joinRoom: MouseEventHandler<HTMLButtonElement> = () => {
        socket?.emit('join-room', roomCodeInput)
    }

    useEffect(() => {
        socket?.on('valid-room', ({ roomCode, isHost }) => {
            setRoomCode(roomCode);
            isHost ? navigate('host') : navigate('player');
        })
        socket?.on('invalid-room', () => {
            setError(true)
        })
    }, [socket]);

    return (
        <>
            <h2><input type='text' placeholder='room code' onChange={(e) => setRoomCodeInput(e.target.value)} /><button onClick={joinRoom}>Join Room</button></h2>
            <button onClick={createRoom}>Create Room</button>
            {error && <h3>Invalid roomcode</h3>}
        </>
    )
}

export default Home
