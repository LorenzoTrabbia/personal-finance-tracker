import { createContext } from "react";

type AppContextType = {
    currency: string;
    setCurrency: (currency: string) => void;
    userName: string;
    refreshPreferences: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);
