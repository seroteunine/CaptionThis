import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { RoomProvider } from './context/RoomContext.tsx'
import { NameProvider } from './context/NamesContext.tsx'
import { ImageProvider } from './context/ImagesContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <RoomProvider>
    <NameProvider>
      <ImageProvider>
        <App />
      </ImageProvider>
    </NameProvider>
  </RoomProvider>

)
