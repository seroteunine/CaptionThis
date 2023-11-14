import { useEffect, useState } from 'react';
import Home from './pages/Home';
import socket from './socket';
import Host from './pages/Host';
import Player from './pages/Player';

function App() {

  const [hasSession, setHasSession] = useState(false);

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
  }, []);

  const createRoom = () => {
    socket.emit('host:create-room');
  }

  const joinRoom = () => {
    socket.emit('player:join-room');
  }

  return (
    <>
      {!hasSession ?
        <Home createRoom={createRoom} joinRoom={joinRoom}></Home> :
        <Host></Host>
      }
    </>
  );
}

export default App
