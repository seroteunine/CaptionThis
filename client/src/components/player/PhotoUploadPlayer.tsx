import { useState } from "react";
import { useWebSocket } from "../../context/socket";

function PhotoUploadPlayer() {

    const socket = useWebSocket()!;

    const [file, setFile] = useState<File>();

    function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    function sendFile() {
        socket.emit('player:send-image', file);
    }

    return (
        <div>
            <h1>Photo uploading phase</h1>
            <input onChange={selectFile} type="file"></input><button onClick={sendFile}>Use this image</button>
        </div>
    )
}

export default PhotoUploadPlayer