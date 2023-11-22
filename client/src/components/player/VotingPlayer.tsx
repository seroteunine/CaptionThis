import { useEffect, useState } from "react"
import socket from "../../socket"

type Caption = {
    authorPlayerID: string,
    captionText: string
}

type CaptionedPhotoDTO = {
    owner: string,
    captions: Caption[]
}

function VotingPlayer() {

    const [isOwnPhoto, setIsOwnPhoto] = useState(false);
    const [captions, setCaptions] = useState<Caption[]>();

    useEffect(() => {
        socket.on('player:captioned-photo', (captionDTO: CaptionedPhotoDTO) => {
            setCaptions(captionDTO.captions);
        })

        socket.on('player:own-photo', () => {
            setIsOwnPhoto(true);
        })

        return () => {
            socket.off('player:captioned-photo');
            socket.off('player:own-photo');
        }

    }, [])

    return (
        <div>
            <h1>Voting phase</h1>
            {captions ? (
                <div>
                    {isOwnPhoto ? (
                        <h2>This is your photo. So you can not vote.</h2>
                    ) : (
                        <div>
                            <h2>Vote on your favourite caption:</h2>
                            {captions.map((caption) => (
                                <h3 key={caption.authorPlayerID}>{caption.captionText}</h3>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <h2>Loading...</h2>
            )}

        </div>
    )
}

export default VotingPlayer