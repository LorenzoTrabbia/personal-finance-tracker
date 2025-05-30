import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export default function Settings() {
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user?.displayName) {
            setDisplayName(user.displayName);
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (user) {
            try {
                await updateProfile(user, { displayName });
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, { displayName });
                setMessage("Nome aggiornato con successo!");
            } catch (error) {
                setMessage("Errore durante l'aggiornamento.");
                console.error(error);
            }
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
