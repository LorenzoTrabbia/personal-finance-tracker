import { createContext } from "react";
import type { Transaction } from "../types/Transaction";

type AppContextType = {
    currency: string;
    setCurrency: (currency: string) => void;
    userName: string;
    avatar: string | null;
    refreshPreferences: () => Promise<void>;
    isDarkMode: boolean;
    toggleTheme: () => void;
    transactions: Transaction[];
    fetchTransactions: () => Promise<void>;
    loadingTransactions: boolean;
    transactionError: string | null;
};

const defaultContext: AppContextType = {
    currency: '€',
    setCurrency: () => {},
    userName: '',
    avatar: null,
    refreshPreferences: async () => {},
    isDarkMode: false,
    toggleTheme: () => {},
    transactions: [],
    fetchTransactions: async () => {},
    loadingTransactions: true,
    transactionError: null
};

export const AppContext = createContext<AppContextType>(defaultContext);
