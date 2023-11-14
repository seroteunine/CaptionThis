import { useEffect, useState } from 'react';
import Home from './pages/Home';
import socket from './socket';
import Host from './pages/Host';
import Player from './pages/Player';

function App() {

  const [roomCode, setRoomCode] = useState('');
  const [isPlayer, setIsPlayer] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState();

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

    socket.on('host:game-update', ({ gameState }) => {
      setIsHost(true);
      setGameState(gameState);
    })

    socket.on('player:game-update', ({ gameState }) => {
      setIsPlayer(true);
      setGameState(gameState);
    })

    return () => {
      socket.off('session');
      socket.off('host:game-update');
      socket.off('player:game-update');
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
      {isHost ? <Host gameState={gameState}></Host> :
        isPlayer ? <Player gameState={gameState}></Player> :
          <Home createRoom={createRoom} joinRoom={joinRoom} setRoomCode={setRoomCode}></Home>
      }
    </>
  );
}

export default App
