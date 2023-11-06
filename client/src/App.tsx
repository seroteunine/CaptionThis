import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import WaitingRoom from './pages/WaitingRoom';
import { socket, SocketContext } from "./context/socket";

function App() {

  return (
    <SocketContext.Provider value={{ socket }}>

      <BrowserRouter>
        <Routes>
          <Route path='' element={<Home />}></Route>
          <Route path='waitingroom' element={<WaitingRoom />}></Route>
        </Routes>
      </BrowserRouter>

    </SocketContext.Provider>
  );
}

export default App
