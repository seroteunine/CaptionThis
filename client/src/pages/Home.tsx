import { MouseEventHandler, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';

function Home({ socket, setInLobby }: { socket: Socket, setInLobby: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [roomID, setRoomID] = useState('');

    const createRoom: MouseEventHandler<HTMLButtonElement> = () => {
        console.log('creat room');
    }

    const joinRoom: MouseEventHandler<HTMLButtonElement> = () => {
        console.log('join room');
    }

    const createOrJoinRoom = () => {
        setInLobby(false);
        socket.connect();
    }

    return (
        <>
            <h2><input type='text' placeholder='room code' onChange={(e) => setRoomID(e.target.value)} /><button onClick={joinRoom}>Join Room</button></h2>
            <button onClick={createOrJoinRoom}>Create Room</button>
        </>
    )
}

export default Home
