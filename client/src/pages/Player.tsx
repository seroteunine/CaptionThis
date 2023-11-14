import { useState } from 'react'


function Player() {

    const [file, setFile] = useState();

    // const upload = () => {
    //     if (file) {
    //         socket?.emit('send-image', { roomCode: roomCode, image: file });
    //     }
    // }

    const loadFile = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    return (
        <>
            <h1>WaitingRoom - Player</h1>
            <input type="file" name="myImage" onChange={loadFile} /><button>Send file</button>
        </>
    )
}

export default Player
