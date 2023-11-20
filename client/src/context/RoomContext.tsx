import React, { createContext, useContext, useState } from 'react';

type GameDTO = {
    phase: string;
    playerNames: string[];
    photos: { [k: string]: ArrayBuffer };
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playersIDToName: { [k: string]: string };
    game: GameDTO | undefined
}

type RoomContextType = {
    roomDTO: RoomDTO | undefined;
    setRoomDTO: React.Dispatch<React.SetStateAction<RoomDTO | undefined>>;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [roomDTO, setRoomDTO] = useState<RoomDTO | undefined>(undefined);

    return (
        <RoomContext.Provider value={{ roomDTO, setRoomDTO }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context;
};