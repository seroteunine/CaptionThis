import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { RoomProvider } from './context/RoomContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

    <RoomProvider>
      <App />
    </RoomProvider>

)
