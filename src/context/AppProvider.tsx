import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { currencyOptions } from "../types/Currency";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [currency, setCurrency] = useState("€");
    const [userName, setUserName] = useState("");

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
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) fetchPreferences();
        });
        return () => unsubscribe();
    }, []);

    return (
        <AppContext.Provider value={{ currency, setCurrency, userName, refreshPreferences: fetchPreferences }}>
            {children}
        </AppContext.Provider>
    );
};

