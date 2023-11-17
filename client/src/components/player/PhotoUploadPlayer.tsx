import { useState } from "react";
import { sendFile } from '../../service/SocketService';

function PhotoUploadPlayer() {

    const [file, setFile] = useState<File>();

    function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    function handleSendFile() {
        if (file) {
            sendFile(file);
        }
    }

    return (
        <div>
            <h1>Photo uploading phase</h1>
            <input onChange={selectFile} type="file"></input><button className="px-4 py-2 rounded font-bold bg-white" onClick={handleSendFile}>Use this image</button>
        </div>
    )
}

export default PhotoUploadPlayer