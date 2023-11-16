import './index.css';

import { useEffect, useState } from 'react';
import Home from './pages/Home';
import socket from './socket';
import Host from './pages/Host';
import Player from './pages/Player';

type GameDTO = {
  phase: string;
  players: string[];
}

type RoomDTO = {
  roomID: string,
  hostID: string,
  playerIDs: string[],
  game: GameDTO | undefined
}

function App() {

  const [roomCode, setRoomCode] = useState('');
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomDTO, setRoomDTO] = useState<RoomDTO>();

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

    socket.on('host:room-update', (roomDTO) => {
      setIsHost(true);
      setRoomDTO(roomDTO);
    })

    socket.on('player:room-update', (roomDTO) => {
      setIsPlayer(true);
      setRoomDTO(roomDTO);
    })

    socket.on('player:invalid-room', () => {
      setCodeInvalid(true);
    })

    return () => {
      socket.off('session');
      socket.off('host:room-update');
      socket.off('player:room-update');
      socket.off('player:invalid-room');
    }

  }, []);

  const createRoom = () => {
    socket.emit('host:create-room');
  }

  const joinRoom = () => {
    socket.emit('player:join-room', roomCode);
  }

  const startgame = () => {
    if (roomDTO) {
      const roomID = roomDTO.roomID;
      socket.emit('host:start-game', roomID);
    } else {
      console.log('game cannot be started because there is no roomstate.');
    }
  }

  return (
    <div className='min-h-screen bg-blue-100 font-bold'>
      {isHost ? <Host roomDTO={roomDTO!} startGame={startgame}></Host> :
        isPlayer ? <Player roomDTO={roomDTO!}></Player> :
          <Home createRoom={createRoom} joinRoom={joinRoom} setRoomCode={setRoomCode} codeInvalid={codeInvalid}></Home>
      }
    </div>
  );
}

export default App
