import { MouseEventHandler, useEffect, useState } from 'react'

function Home({ createRoom, joinRoom }: { createRoom: MouseEventHandler<HTMLButtonElement>, joinRoom: MouseEventHandler<HTMLButtonElement> }) {
    const [roomID, setRoomID] = useState('');

    return (
        <>
            <h2><input type='text' placeholder='room code' onChange={(e) => setRoomID(e.target.value)} /><button onClick={joinRoom}>Join Room</button></h2>
            <button onClick={createRoom}>Create Room</button>
        </>
    )
}

export default Home
