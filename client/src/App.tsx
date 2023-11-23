import './index.css';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Host from './pages/Host';
import Player from './pages/Player';
import socket from './socket';
import { useRoom } from './context/RoomContext';
import { useNameContext } from './context/NamesContext';

function App() {

  const [codeInvalid, setCodeInvalid] = useState(false);
  const playerID = sessionStorage.getItem("playerID");

  const { roomDTO, setRoomDTO } = useRoom();
  const { nameMap, setNameMap } = useNameContext();

  useEffect(() => {

    socket.on('host:room-update', (roomDTO) => {
      setRoomDTO(roomDTO);
    })

    socket.on('host:name-update', ({ playerID, name }) => {
      setNameMap(nameMap.set(playerID, name));
    })

    socket.on('player:room-update', (roomDTO) => {
      setRoomDTO(roomDTO);
    })

    socket.on('host:invalid-gamestart', () => {
      alert('Game could not be started.')
    })

    socket.on('player:invalid-room', () => {
      setCodeInvalid(true);
    })

    //For reconnections
    if (playerID) {
      socket.auth = { playerID };
      sessionStorage.setItem("playerID", playerID);
    }

    socket.on("playerID", (playerID) => {
      socket.auth = { playerID };
      sessionStorage.setItem("playerID", playerID);
    });

    return () => {
      socket.off('host:room-update');
      socket.off('player:room-update');
      socket.off('host:invalid-gamestart');
      socket.off('player:invalid-room');
      socket.off('playerID');
    }
  }, []);

  return (
    <div className='min-h-screen bg-blue-100 font-bold'>
      {!roomDTO ?
        <Home codeInvalid={codeInvalid}></Home>
        :
        (roomDTO.hostID === playerID) ?
          <Host></Host> :
          <Player></Player>
      }
    </div>
  );
}

export default App
