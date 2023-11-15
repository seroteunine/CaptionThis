import { MouseEventHandler } from 'react'

function Home({ createRoom, joinRoom, setRoomCode, codeInvalid }: { createRoom: MouseEventHandler<HTMLButtonElement>, joinRoom: MouseEventHandler<HTMLButtonElement>, setRoomCode: React.Dispatch<React.SetStateAction<string>>, codeInvalid: boolean }) {

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='mt-[-300px] flex flex-col p-6 bg-white shadow-md space-y-4'>
                {codeInvalid && <h3 className='text-red-400'>Invalid roomcode</h3>}
                <input className='p-2 border border-gray-300' type='text' placeholder='room code' onChange={(e) => setRoomCode(e.target.value)} />
                <button className='p-2 bg-blue-400 rounded-md text-white' onClick={joinRoom}>Join Room</button>
                <button className='p-2 bg-green-400 rounded-md text-white' onClick={createRoom}>Create Room</button>
            </div>
        </div>
    )
}

export default Home
