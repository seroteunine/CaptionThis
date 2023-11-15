import { useEffect, useState } from 'react';
import Home from './pages/Home';
import socket from './socket';
import Host from './pages/Host';
import Player from './pages/Player';

type GameDTO = {
  gameID: string;
  gameState: {
    phase: string;
    host: string;
    players: string[];
  };
}

function App() {

  const [roomCode, setRoomCode] = useState('');
  const [isPlayer, setIsPlayer] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState<GameDTO>();

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

    socket.on('host:game-update', (gameDTO) => {
      setIsHost(true);
      setGameState(gameDTO);
    })

    socket.on('player:game-update', (gameDTO) => {
      setIsPlayer(true);
      setGameState(gameDTO);
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

  const startGame = () => {
    if (gameState) {
      const gameID = gameState.gameID;
      socket.emit('host:start-game', gameID);
    } else {
      console.log('game cannot be started because there is no gamestate.');
    }
  }

  return (
    <>
      {isHost ? <Host gameState={gameState!} startGame={startGame}></Host> :
        isPlayer ? <Player gameState={gameState!}></Player> :
          <Home createRoom={createRoom} joinRoom={joinRoom} setRoomCode={setRoomCode}></Home>
      }
    </>
  );
}

export default App
