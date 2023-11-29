import './index.scss';
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
  const { setNameMap } = useNameContext();

  useEffect(() => {

    socket.on('host:room-update', (roomDTO) => {
      setRoomDTO(roomDTO);
    })

    socket.on('host:name-update', ({ playerID, username }) => {
      setNameMap((nameMap) => !Array.from(nameMap.values()).includes(username) ? new Map<string, string>(nameMap).set(playerID, username) : nameMap);
    });

    socket.on('player:room-update', (roomDTO) => {
      setRoomDTO(roomDTO);
    })

    socket.on('host:invalid-gamestart', () => {
      alert('Game could not be started.')
    })

    socket.on('player:invalid-room', () => {
      setCodeInvalid(true);
    })

    socket.on('alert:removed', () => {
      alert('This session has been removed due to inactivity. Please start a game in a new tab.')
      sessionStorage.removeItem("playerID");
      sessionStorage.removeItem("roomID");
    });

    socket.on("session", ({ playerID, roomID }) => {
      socket.auth = { playerID: playerID, roomID: roomID };
      sessionStorage.setItem("playerID", playerID);
      sessionStorage.setItem("roomID", roomID);
    });

    return () => {
      socket.off('host:room-update');
      socket.off('host:name-update');
      socket.off('player:room-update');
      socket.off('host:invalid-gamestart');
      socket.off('player:invalid-room');
      socket.off('alert:removed');
      socket.off('session');
    }
  }, []);

  return (
    <div className='bg-secondary ' style={{ height: '100vh' }}>
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
