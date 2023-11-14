import { useEffect, useState } from 'react';
import Home from './pages/Home';
import socket from './socket';
import Host from './pages/Host';
import Player from './pages/Player';

function App() {

  const [inLobby, setInLobby] = useState(true);
  const [isHost, setIsHost] = useState(true);

  useEffect(() => {

    const sessionID = sessionStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
    }

    socket.on("session", ({ sessionID }) => {
      socket.auth = { sessionID };
      sessionStorage.setItem("sessionID", sessionID);
    });

  }, []);

  return (
    <>
      {inLobby ?
        <Home setInLobby={setInLobby} socket={socket}></Home> :
        <Host></Host>
      }
    </>
  );
}

export default App
