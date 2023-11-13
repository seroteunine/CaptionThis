import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Host from './pages/Host';
import Player from './pages/Player';
import { WebSocketProvider } from './context/socket';
import { RoomCodeProvider } from "./context/roomCode";

function App() {

  return (
    <WebSocketProvider>
      <RoomCodeProvider>

        <BrowserRouter>
          <Routes>
            <Route path='' element={<Home />}></Route>
            <Route path='host' element={<Host />}></Route>
            <Route path='player' element={<Player />}></Route>
          </Routes>
        </BrowserRouter>

      </RoomCodeProvider>
    </WebSocketProvider>
  );
}

export default App
