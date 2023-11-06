import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/socket';

function WaitingRoom() {

    const [roomName, setRoomName] = useState('');

    const { socket } = useContext(SocketContext);

    useEffect(() => {
        socket?.on('valid-room', (data) => {
            setRoomName(data)
        })

        return () => {
            socket?.off('valid-room')
        }
    }, [])

    return (
        <>
            <h1>WaitingRoom</h1>
            <h2>{roomName}</h2>
        </>
    )
}

export default WaitingRoom
