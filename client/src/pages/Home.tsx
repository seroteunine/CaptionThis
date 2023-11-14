import { MouseEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/socket';
import { useRoomCode } from '../context/roomCode';

function Home() {
    const socket = useWebSocket()!;
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const { setRoomCode } = useRoomCode();

    let navigate = useNavigate();
    const [error, setError] = useState(false);

    const createRoom: MouseEventHandler<HTMLButtonElement> = () => {
        socket?.emit('host:create-room')
    }

    const joinRoom: MouseEventHandler<HTMLButtonElement> = () => {
        socket?.emit('player:join-room', roomCodeInput)
    }

    useEffect(() => {

        socket.on("session", ({ sessionID }) => {
            socket.auth = { sessionID };
            sessionStorage.setItem("sessionID", sessionID);
        });

        socket?.on('host:room-created', ({ roomID }) => {
            setRoomCode(roomID);
            sessionStorage.setItem('roomID', roomID);
            navigate('host');
        })
        socket?.on('player:room-joined', ({ roomID }) => {
            setRoomCode(roomID);
            sessionStorage.setItem('roomID', roomID);
            navigate('player');
        })
        socket?.on('player:invalid-room', () => {
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
