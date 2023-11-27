import { useEffect, useState } from "react";
import { sendFile } from '../../service/SocketService';
import socket from "../../socket";

function PhotoUploadPlayer() {

    const [photoReceived, setPhotoReceived] = useState(false);

    useEffect(() => {
        socket.on('player:photo-received', () => {
            setPhotoReceived(true);
        })
    }, [])

    function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            sendFile(file);
        }
    }

    return (
        <div>
            <h1>Photo uploading phase</h1>

            {photoReceived ?
                <h3>Your photo has been uploaded succesfully.</h3>
                :
                <input onChange={selectFile} type="file"></input>
            }

        </div>
    )
}

export default PhotoUploadPlayer