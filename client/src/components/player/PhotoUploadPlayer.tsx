import { useEffect, useState } from "react";
import { sendFile } from '../../service/SocketService';
import socket from "../../socket";

function PhotoUploadPlayer() {

    const [photoReceived, setPhotoReceived] = useState(false);
    const [notReceivedError, setNotReceivedError] = useState(false);

    useEffect(() => {
        socket.on('player:photo-received', () => {
            setPhotoReceived(true);
        })
    }, [])

    function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file.type.match('image.*')) {
                sendFile(file);
            }
            setNotReceivedError(true);
        }
    }

    return (
        <div>
            <h1>Photo uploading phase</h1>

            {photoReceived ?
                <h3>Your photo has been uploaded succesfully.</h3>
                :
                <div>
                    <input onChange={selectFile} type="file"></input>
                    {notReceivedError && <h3>This file is not supported. Try another photo.</h3>}
                </div>

            }
        </div>
    )
}

export default PhotoUploadPlayer