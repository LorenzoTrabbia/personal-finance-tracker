import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { currencyOptions } from "../types/Currency";
import { AppContext } from "./AppContext";
import type { Transaction } from "../types/Transaction";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [currency, setCurrency] = useState("€");
    const [userName, setUserName] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
    const [transactionError, setTransactionError] = useState<string | null>(null);

    const fetchTransactions = async () => {
        const user = auth.currentUser;
        if (!user?.uid) return;

        setLoadingTransactions(true);
        setTransactionError(null);
        try {
            const q = query(
                collection(db, "users", user.uid, "transactions"),
                orderBy("date", "desc")
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
            setTransactions(data);
        } catch (error) {
            console.error("Errore nel recupero transazioni:", error);
            setTransactionError("We couldn't load your transactions. Check your connection and try again.");
        } finally {
            setLoadingTransactions(false);
        }
    };

    const fetchPreferences = async () => {
        const user = auth.currentUser;
        if (!user?.uid) return;

        setUserName(user.displayName || "");

        const prefRef = doc(db, "users", user.uid, "preferences", "settings");
        const snap = await getDoc(prefRef);

        if (snap.exists()) {
            const data = snap.data();
            const found = currencyOptions.find(c => c.value === data.currency);
            setCurrency(found?.symbol || "€");
            setAvatar(data.avatar || null);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved) {
            document.documentElement.classList.toggle("dark", saved === "dark");
            setIsDarkMode(saved === "dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", prefersDark);
            setIsDarkMode(prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;

        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchPreferences();
                fetchTransactions();
            } else {
                setTransactions([]);
                setTransactionError(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AppContext.Provider value={{
            currency,
            setCurrency,
            userName,
            avatar,
            refreshPreferences: fetchPreferences,
            isDarkMode,
            toggleTheme,
            transactions,
            fetchTransactions,
            loadingTransactions,
            transactionError
        }}>
            {children}
        </AppContext.Provider>
    );
};
