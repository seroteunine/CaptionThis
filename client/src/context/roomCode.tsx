import { ReactNode, createContext, useContext, useState } from "react";

interface RoomCodeContextData {
    roomCode: String | null;
    setRoomCode: React.Dispatch<React.SetStateAction<String | null>>;
}

const roomCodeContext = createContext<RoomCodeContextData>({
    roomCode: null,
    setRoomCode: () => { },
});
export const useRoomCode = () => useContext(roomCodeContext);

export const RoomCodeProvider = ({ children }: { children: ReactNode }) => {
    const [roomCode, setRoomCode] = useState<String | null>(null);

    return (
        <roomCodeContext.Provider value={{ roomCode, setRoomCode }}>
            {children}
        </roomCodeContext.Provider>
    );
};
