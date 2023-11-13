import { useEffect, useState } from 'react'
import { useWebSocket } from '../../context/socket';
import { useRoomCode } from '../../context/roomCode';

function WaitingRoomHost() {

    const socket = useWebSocket();

    const { roomCode } = useRoomCode();
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {

        socket?.on('send-image', (arrayBuffer) => {
            const blob = new Blob([arrayBuffer]);
            const imageUrl = URL.createObjectURL(blob);
            setImages((previmages) => [...previmages, imageUrl]);
        });

        return () => {
            socket?.off('send-image');
            if (images) images.forEach((image) => URL.revokeObjectURL(image));
        };

    }, [images])

    return (
        <>
            <h1>WaitingRoom - Host</h1>
            <h2>{roomCode}</h2>
            {images.map((imageUrl, index) => (
                <img key={index} src={imageUrl} style={{ width: 400, height: "auto" }} />
            ))}
        </>
    )
}

export default WaitingRoomHost
