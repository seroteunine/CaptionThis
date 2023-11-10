import { useEffect } from 'react'
import { useWebSocket } from '../context/socket';
import { useRoomCode } from '../context/roomCode';

function WaitingRoom() {

    const socket = useWebSocket();

    const { roomCode } = useRoomCode();

    useEffect(() => {

        return () => {
        }
    }, [])

    return (
        <>
            <h1>WaitingRoom</h1>
            <h2>{roomCode}</h2>
        </>
    )
}

export default WaitingRoom
