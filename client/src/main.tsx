import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { RoomProvider } from './context/RoomContext.tsx'
import { NameProvider } from './context/NamesContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <RoomProvider>
    <NameProvider>
      <App />
    </NameProvider>
  </RoomProvider>

)
