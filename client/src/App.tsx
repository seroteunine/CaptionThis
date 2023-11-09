import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import WaitingRoom from './pages/WaitingRoom';
import { WebSocketProvider } from './context/socket';

function App() {

  return (
    <WebSocketProvider>

      <BrowserRouter>
        <Routes>
          <Route path='' element={<Home />}></Route>
          <Route path='waitingroom' element={<WaitingRoom />}></Route>
        </Routes>
      </BrowserRouter>

    </WebSocketProvider>
  );
}

export default App
