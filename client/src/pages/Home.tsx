import { MouseEventHandler, useEffect, useState } from 'react'

function Home({ createRoom, joinRoom, setRoomCode }: { createRoom: MouseEventHandler<HTMLButtonElement>, joinRoom: MouseEventHandler<HTMLButtonElement>, setRoomCode: React.Dispatch<React.SetStateAction<string>> }) {

    return (
        <>
            <h2><input type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)} /><button onClick={joinRoom}>Join Room</button></h2>
            <button onClick={createRoom}>Create Room</button>
        </>
    )
}

export default Home
