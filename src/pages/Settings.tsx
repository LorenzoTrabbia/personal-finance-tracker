import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Types
import { currencyOptions } from "../types/Currency";
import { useAppContext } from "../context/useAppContext";
import { updateTransactionsCurrency } from "../utils/updateTransactionsCurrency";

export default function Settings() {
    const user = auth.currentUser;
    const { refreshPreferences } = useAppContext();

    const [displayName, setDisplayName] = useState("");
    const [currency, setCurrency] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                if (user.displayName) setDisplayName(user.displayName);

                const prefDoc = await getDoc(doc(db, "users", user.uid, "preferences", "settings"));
                if (prefDoc.exists()) {
                    const prefs = prefDoc.data();
                    if (prefs.currency) setCurrency(prefs.currency);
                }
            }
        };
        fetchData();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!user) return;

        try {
            const preferencesRef = doc(db, "users", user.uid, "preferences", "settings");
            const oldPrefSnap = await getDoc(preferencesRef);
            const oldCurrency = oldPrefSnap.exists() ? oldPrefSnap.data().currency : null;

            await updateProfile(user, { displayName });
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { displayName });

            await setDoc(preferencesRef, { currency }, { merge: true });

            if (oldCurrency && currency !== oldCurrency) {
                await updateTransactionsCurrency(user.uid, oldCurrency, currency);
            }

            await refreshPreferences();
            setMessage("Impostazioni salvate con successo!");
        } catch (error) {
            console.error(error);
            setMessage("Errore durante il salvataggio.");
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 bg-light-background dark:bg-dark-background p-6 rounded shadow text-light-text-primary dark:text-dark-text-primary">
            <h2 className="text-2xl font-bold mb-4">Impostazioni profilo</h2>
            <form onSubmit={handleSave} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="border border-light-border dark:border-dark-border p-2 rounded bg-white dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                    placeholder="Il tuo nome"
                />

                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="border border-light-border dark:border-dark-border p-2 rounded bg-white dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                >
                    <option value="">Seleziona valuta</option>
                    {currencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="bg-light-primary dark:bg-dark-primary text-white py-2 rounded hover:opacity-90 transition"
                >
                    Salva
                </button>

                {message && (
                    <p className="text-sm text-center mt-2 text-light-text-secondary dark:text-dark-text-secondary">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}

