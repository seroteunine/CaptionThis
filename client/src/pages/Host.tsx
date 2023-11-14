import { useState } from 'react'

function Host() {

    const [images, setImages] = useState<string[]>([]);

    // useEffect(() => {

    //     socket.on('send-image', (arrayBuffer) => {
    //         const blob = new Blob([arrayBuffer]);
    //         const imageUrl = URL.createObjectURL(blob);
    //         setImages((previmages) => [...previmages, imageUrl]);
    //     });

    //     socket.on('game-status', (gameDTO) => {
    //         console.log(gameDTO);
    //     })

    //     return () => {
    //         socket.off('send-image');
    //         socket.off('game-status');
    //         if (images) images.forEach((image) => URL.revokeObjectURL(image));
    //     };

    // }, [images])

    // const startGame = () => {
    //     socket.emit('host:start-game', roomCode);
    // };

    return (
        <>
            <h1>WaitingRoom - Host</h1>
            <button > Start game </button>
            {images.map((imageUrl, index) => (
                <img key={index} src={imageUrl} style={{ width: 400, height: "auto" }} />
            ))}
        </>
    )
}

export default Host
