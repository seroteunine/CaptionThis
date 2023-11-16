import PhotoUploadPlayer from "../components/player/PhotoUploadPlayer";

type GameDTO = {
    phase: string;
    players: string[];
    photos: { [k: string]: ArrayBuffer };
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playerIDs: string[],
    game: GameDTO | undefined
}

function Player({ roomDTO }: { roomDTO: RoomDTO }) {

    return (
        <>
            <h1>Room: {roomDTO.roomID} - You're a player</h1>

            {roomDTO.game ?
                <PhotoUploadPlayer></PhotoUploadPlayer>
                :
                <h2>Wait for game to start.</h2>
            }
        </>
    )
}

export default Player
