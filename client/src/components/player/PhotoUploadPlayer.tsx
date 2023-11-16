import { useState } from "react";
import socket from '../../socket';

function PhotoUploadPlayer() {

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
            <input onChange={selectFile} type="file"></input><button className="px-4 py-2 rounded font-bold bg-white" onClick={sendFile}>Use this image</button>
        </div>
    )
}

export default PhotoUploadPlayer