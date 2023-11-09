import { useContext, useEffect, useState } from 'react'
import { useWebSocket } from '../context/socket';

function WaitingRoom() {

    const socket = useWebSocket();

    const [roomName, setRoomName] = useState('');
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket?.emit('get-players', localStorage.getItem('roomID'));

        socket?.on('valid-room', (data) => {
            setRoomName(data)
        })

        socket?.on('all-players', (data) => {
            setPlayers(data);
        })

        return () => {
            socket?.off('valid-room')
        }
    }, [])

    return (
        <>
            <h1>WaitingRoom</h1>
            <h2>{roomName}</h2>
            {players &&
                players.map((player) => (
                    <h3 key={player}>{player}</h3>
                ))}

        </>
    )
}

export default WaitingRoom
