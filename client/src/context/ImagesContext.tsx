import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

type ImagesContextType = {
    photos: { [k: string]: ArrayBuffer };
    setPhotos: Dispatch<SetStateAction<{ [k: string]: ArrayBuffer }>>;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export const ImageProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [photos, setPhotos] = useState<{ [k: string]: ArrayBuffer }>({});

    return (
        <ImagesContext.Provider value={{ photos, setPhotos }}>
            {children}
        </ImagesContext.Provider>
    );
};

export const useImagesContext = () => {
    const context = useContext(ImagesContext);
    if (!context) {
        throw new Error('useImages must be used within a ImageProvider');
    }
    return context;
};
