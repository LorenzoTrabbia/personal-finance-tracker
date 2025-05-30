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
                // 1. Aggiorna displayName in Firebase Auth
                await updateProfile(user, { displayName });

                // 2. Aggiorna displayName in Firestore
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
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Impostazioni profilo</h2>
            <form onSubmit={handleSave} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="border p-2 rounded"
                    placeholder="Il tuo nome"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                >
                    Salva
                </button>
                {message && <p className="text-sm text-center mt-2">{message}</p>}
            </form>
        </div>
    );
}
