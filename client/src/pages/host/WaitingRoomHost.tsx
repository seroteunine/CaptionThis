import { useEffect, useState } from 'react'
import { useWebSocket } from '../../context/socket';
import { useRoomCode } from '../../context/roomCode';

function WaitingRoomHost() {

    const socket = useWebSocket();

    const { roomCode } = useRoomCode();
    const [messages, setMessages] = useState<String[]>([]);

    useEffect(() => {
        socket?.emit('get-waitingroom-start');

        socket?.on('send-message', (data) => {
            setMessages((messages) => [...messages, data]);
        })

        return () => {
            socket?.off('waitingroom-start');
            socket?.off('send-message');
        }
    }, [])

    return (
        <>
            <h1>WaitingRoom - Host</h1>
            <h2>{roomCode}</h2>
            {messages.map((msg, index) => (
                <h3 key={index}>{msg}</h3>
            ))}
        </>
    )
}

export default WaitingRoomHost
