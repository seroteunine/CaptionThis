import { useEffect, useState } from 'react'
import { useWebSocket } from '../../context/socket';
import { useRoomCode } from '../../context/roomCode';

function WaitingRoomHost() {

    const socket = useWebSocket();

    const { roomCode } = useRoomCode();
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        socket?.emit('get-waitingroom-start');

        socket?.on('send-image', (arrayBuffer) => {
            const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setImages((previmages) => [...previmages, imageUrl]);
        })

        return () => {
            socket?.off('waitingroom-start');
            socket?.off('send-image');
        }
    }, [])

    return (
        <>
            <h1>WaitingRoom - Host</h1>
            <h2>{roomCode}</h2>
            {images.map((imageUrl, index) => (
                <img key={index} src={imageUrl} style={{ width: 150, height: "auto" }} />
            ))}
        </>
    )
}

export default WaitingRoomHost
