import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import WaitingRoomHost from './pages/host/WaitingRoomHost';
import WaitingRoomPlayer from './pages/player/WaitingRoomPlayer';
import { WebSocketProvider } from './context/socket';
import { RoomCodeProvider } from "./context/roomCode";

function App() {

  return (
    <WebSocketProvider>
      <RoomCodeProvider>

        <BrowserRouter>
          <Routes>
            <Route path='' element={<Home />}></Route>
            <Route path='waitingroom-host' element={<WaitingRoomHost />}></Route>
            <Route path='waitingroom-player' element={<WaitingRoomPlayer />}></Route>
          </Routes>
        </BrowserRouter>

      </RoomCodeProvider>
    </WebSocketProvider>
  );
}

export default App
