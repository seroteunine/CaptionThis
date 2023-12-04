import React, { createContext, useContext, useState } from 'react';

type Caption = {
    ID: number;
    authorPlayerID: string;
    photoOwnerPlayerID: string;
    captionText: string;
}

type Vote = {
    playerID: string;
    captionID: number;
}

type Phase = "PHOTO_UPLOAD" | "CAPTION" | "VOTING" | "END";

type GameDTO = {
    phase: Phase;
    playerIDs: string[];
    captions: Caption[];
    votes: { [k: string]: Vote[] };
    votingRound: number;
    score: { [k: string]: number };
}

type RoomDTO = {
    roomID: string,
    hostID: string,
    playerIDs: string[];
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
