import { useEffect, useState } from 'react'
import { useWebSocket } from '../context/socket';
import { useRoomCode } from '../context/roomCode';
import { GameService } from '../service/gameService';

function Host() {

    const socket = useWebSocket()!;

    const { roomCode } = useRoomCode();
    const [images, setImages] = useState<string[]>([]);

    const gameService = new GameService(socket);

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

    const startGame = () => {
        gameService.startGame();
    };

    return (
        <>
            <h1>WaitingRoom - Host</h1>
            <h2>{roomCode}</h2>
            <button onClick={startGame}> Start game </button>
            {images.map((imageUrl, index) => (
                <img key={index} src={imageUrl} style={{ width: 400, height: "auto" }} />
            ))}
        </>
    )
}

export default Host
