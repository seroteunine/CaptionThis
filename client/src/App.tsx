import { useEffect, useState } from 'react';
import Home from './pages/Home';
import socket from './socket';
import Host from './pages/Host';
import Player from './pages/Player';

function App() {

  const [roomCode, setRoomCode] = useState('');
  const [isPlayer, setIsPlayer] = useState(false);
  const [isHost, setIsHost] = useState(false);

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

    socket.on('host:room-created', () => {
      setIsHost(true);
    })

    socket.on('player:room-joined', () => {
      setIsPlayer(true);
    })

    return () => {
      socket.off('session');
      socket.off('host:room-created');
      socket.off('player:room-joined');
    }

  }, []);

  const createRoom = () => {
    socket.emit('host:create-game');
  }

  const joinRoom = () => {
    socket.emit('player:join-game', roomCode);
  }

  return (
    <>
      {isHost ? <Host></Host> :
        isPlayer ? <Player></Player> :
          <Home createRoom={createRoom} joinRoom={joinRoom} setRoomCode={setRoomCode}></Home>
      }
    </>
  );
}

export default App
