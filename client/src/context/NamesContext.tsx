import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

type NameContextType = {
    nameMap: Map<string, string>;
    setNameMap: Dispatch<SetStateAction<Map<string, string>>>;
};

const NameContext = createContext<NameContextType | undefined>(undefined);

export const NameProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [nameMap, setNameMap] = useState<Map<string, string>>(new Map<string, string>());

    return (
        <NameContext.Provider value={{ nameMap, setNameMap }}>
            {children}
        </NameContext.Provider>
    );
};

export const useNameContext = () => {
    const context = useContext(NameContext);
    if (!context) {
        throw new Error('useNames must be used within a NameProvider');
    }
    return context;
};
