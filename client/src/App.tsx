import './index.css';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Host from './pages/Host';
import Player from './pages/Player';
import socket from './socket';

type GameDTO = {
  phase: string;
  playerNames: string[];
  photos: { [k: string]: ArrayBuffer };
}

type RoomDTO = {
  roomID: string,
  hostID: string,
  playersIDToName: { [k: string]: string };
  game: GameDTO | undefined
}

function App() {

  const [roomCode, setRoomCode] = useState('');
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomDTO, setRoomDTO] = useState<RoomDTO>();

  useEffect(() => {

    const playerID = sessionStorage.getItem("playerID");

    if (playerID) {
      socket.auth = { playerID };
      sessionStorage.setItem("sessionID", playerID);
    }

    socket.on("playerID", (playerID) => {
      socket.auth = { playerID };
      sessionStorage.setItem("playerID", playerID);
    });

    socket.on('host:room-update', (roomDTO) => {
      setIsHost(true);
      setRoomDTO(roomDTO);
    })

    socket.on('host:invalid-gamestart', () => {
      alert('Game could not be started.')
    })

    socket.on('player:room-update', (roomDTO) => {
      setIsPlayer(true);
      setRoomDTO(roomDTO);
    })

    socket.on('player:invalid-room', () => {
      setCodeInvalid(true);
    })

    return () => {
      socket.off('playerID');
      socket.off('host:room-update');
      socket.off('host:invalid-gamestart');
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
