import { useState } from 'react'
import { useWebSocket } from '../../context/socket';
import { useRoomCode } from '../../context/roomCode';

function WaitingRoomPlayer() {

    const socket = useWebSocket();

    const { roomCode } = useRoomCode();
    const [file, setFile] = useState();

    const upload = () => {
        if (file) {
            socket?.emit('send-image', { roomCode: roomCode, image: file });
        }
    }

    const loadFile = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    return (
        <>
            <h1>WaitingRoom - Player</h1>
            <h2>{roomCode}</h2>
            <input type="file" name="myImage" onChange={loadFile} /><button onClick={upload}>Send file</button>
        </>
    )
}

export default WaitingRoomPlayer
