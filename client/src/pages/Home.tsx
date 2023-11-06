import { MouseEventHandler, useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/socket'
import { useNavigate } from 'react-router-dom';

function Home() {

    const { socket } = useContext(SocketContext);
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
        socket?.on('valid-room', () => {
            navigate('waitingroom');
        })
        socket?.on('invalid-room', () => {
            setError(true)
        })
    }, []);

    return (
        <>
            <h1><input type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)} /><button onClick={joinRoom}>Join Room</button></h1>
            <button onClick={createRoom}>Create Room</button>
            {error && <h3>Invalid roomcode</h3>}
        </>
    )
}

export default Home
