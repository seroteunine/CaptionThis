import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import WaitingRoom from './pages/WaitingRoom';
import { WebSocketProvider } from './context/socket';
import { RoomCodeProvider } from "./context/roomCode";

function App() {

  return (
    <WebSocketProvider>
      <RoomCodeProvider>

        <BrowserRouter>
          <Routes>
            <Route path='' element={<Home />}></Route>
            <Route path='waitingroom' element={<WaitingRoom />}></Route>
          </Routes>
        </BrowserRouter>

      </RoomCodeProvider>
    </WebSocketProvider>
  );
}

export default App
