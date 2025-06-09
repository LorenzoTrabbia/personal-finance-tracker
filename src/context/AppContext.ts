import { createContext } from "react";

type AppContextType = {
    currency: string;
    setCurrency: (currency: string) => void;
    userName: string;
    avatar: string | null;
    refreshPreferences: () => Promise<void>;
    isDarkMode: boolean;
    toggleTheme: () => void;
};

const defaultContext: AppContextType = {
    currency: '€',
    setCurrency: () => {},
    userName: '',
    avatar: null,
    refreshPreferences: async () => {},
    isDarkMode: false,
    toggleTheme: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

