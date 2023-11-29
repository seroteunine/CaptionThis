import { useState } from 'react'
import { createRoom, joinRoom } from '../service/SocketService'

function Home({ codeInvalid }: { codeInvalid: boolean }) {

    const [roomCode, setRoomCode] = useState('');

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        joinRoom(roomCode)
    }

    return (
        <div className='container d-flex justify-content-center align-items-center min-vh-100'>
            <div className='card shadow col-9 col-md-4 col-lg-3'>
                <form onSubmit={handleJoinRoom} className='card-body'>
                    {codeInvalid && <span className='text-danger'>Invalid roomcode</span>}
                    <input className='form-control mb-3' type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)} autoFocus/>
                    <button type='submit' className='btn w-100 btn-primary mb-2'>Join Room</button>
                    <button type='button' className='btn w-100 btn-success' onClick={createRoom}>Create Room</button>
                </form>
            </div>
        </div>
    )
}

export default Home
