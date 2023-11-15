import { MouseEventHandler } from 'react'

function Home({ createRoom, joinRoom, setRoomCode }: { createRoom: MouseEventHandler<HTMLButtonElement>, joinRoom: MouseEventHandler<HTMLButtonElement>, setRoomCode: React.Dispatch<React.SetStateAction<string>> }) {

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='flex flex-col p-6 bg-white shadow-md space-y-4'>
                <input className='p-2 border border-gray-300' type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)} />
                <button className='p-2 bg-blue-400 rounded-md text-white' onClick={joinRoom}>Join Room</button>
                <button className='p-2 bg-green-400 rounded-md text-white' onClick={createRoom}>Create Room</button>
            </div>
        </div>
    )
}

export default Home
