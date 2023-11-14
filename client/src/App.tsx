import { useEffect, useState } from 'react';
import Home from './pages/Home';
import socket from './socket';
import Host from './pages/Host';
import Player from './pages/Player';

function App() {

  const [hasSession, setHasSession] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    const sessionID = sessionStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      sessionStorage.setItem("sessionID", sessionID);
    }

    socket.on("session", (sessionID) => {
      socket.auth = { sessionID };
      sessionStorage.setItem("sessionID", sessionID);
    });

    socket.on('host:room-created', ({ room, roomID }: any) => {
      console.log('created room', room, roomID);
    })

    socket.on('player:room-joined', (room) => {
      console.log('joined room', room);
    })

    return () => {
      socket.off('session');
      socket.off('host:room-created');
      socket.off('player:room-joined');
    }

  }, []);

  const createRoom = () => {
    socket.emit('host:create-room');
  }

  const joinRoom = () => {
    socket.emit('player:join-room', roomCode);
  }

  return (
    <>
      {!hasSession ?
        <Home createRoom={createRoom} joinRoom={joinRoom} setRoomCode={setRoomCode}></Home> :
        <Host></Host>
      }
    </>
  );
}

export default App
