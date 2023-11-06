import { useEffect } from 'react'
import { io } from 'socket.io-client'

function App() {

  useEffect(() => {
    const socket = io('http://localhost:5000')

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [])

  return (
    <>
      <h1>Swag</h1>
    </>
  )
}

export default App
