import { useState } from 'react'
import { createRoom, joinRoom } from '../service/SocketService'

function Home({ codeInvalid }: { codeInvalid: boolean }) {

    const [roomCode, setRoomCode] = useState('');

    const handleJoinRoom = () => {
        joinRoom(roomCode)
    }

    return (
        <div className='container d-flex justify-content-center align-items'>
            <div className='card shadow'>
                <div className='card-body'>
                    {codeInvalid && <h3 className=''>Invalid roomcode</h3>}
                    <input className='' type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)} />
                    <button className='btn btn-primary w-100 mb-2' onClick={handleJoinRoom}>Join Room</button>
                    <button className='btn btn-success w-100' onClick={createRoom}>Create Room</button>
                </div>
            </div>
        </div>
    )
}

export default Home
