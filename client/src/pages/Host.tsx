import { useState } from 'react'

function Host() {

    const [images, setImages] = useState<string[]>([]);

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
