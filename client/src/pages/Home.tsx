import { MouseEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/socket';

function Home() {
    const socket = useWebSocket();

    let navigate = useNavigate();

    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState(false);

    const createRoom: MouseEventHandler<HTMLButtonElement> = () => {
        socket?.emit('create-room')
    }

    const joinRoom: MouseEventHandler<HTMLButtonElement> = () => {
        socket?.emit('join-room', roomCode)
    }

    useEffect(() => {
        socket?.on('valid-room', (roomCode) => {
            localStorage.setItem('roomID', roomCode)
            navigate('waitingroom');
        })
        socket?.on('invalid-room', () => {
            setError(true)
        })
    }, [socket]);

    return (
        <>
            <h2><input type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)} /><button onClick={joinRoom}>Join Room</button></h2>
            <button onClick={createRoom}>Create Room</button>
            {error && <h3>Invalid roomcode</h3>}
        </>
    )
}

export default Home
