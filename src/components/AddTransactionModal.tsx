import { useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function AddTransactionModal({ onClose }: { onClose: () => void }) {
    const [type, setType] = useState<"income" | "expense">("income");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const user = auth.currentUser;
        if (!user) {
            setError("Utente non autenticato.");
            return;
        }

        try {
            await addDoc(collection(db, "users", user.uid, "transactions"), {
                type,
                name,
                amount: parseFloat(amount.toString()),
                category,
                date,
                createdAt: serverTimestamp(),
            });

            onClose();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Errore Firestore:", err);
            setError("Errore nel salvataggio. Riprova.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">Nuova Transazione</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as "income" | "expense")}
                        className="w-full border border-light-border dark:border-dark-border p-2 rounded bg-white dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        required
                    >
                        <option value="income">Entrata</option>
                        <option value="expense">Uscita</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Nome"
                        className="w-full border border-light-border dark:border-dark-border p-2 rounded bg-white dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Importo"
                        className="w-full border border-light-border dark:border-dark-border p-2 rounded bg-white dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        required
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-light-border dark:border-dark-border p-2 rounded bg-white dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        required
                    >
                        <option value="">Scegli categoria</option>
                        <option value="cibo">Cibo</option>
                        <option value="trasporti">Trasporti</option>
                        <option value="stipendio">Stipendio</option>
                        <option value="tempo libero">Tempo Libero</option>
                        <option value="altro">Altro</option>
                    </select>

                    <input
                        type="date"
                        className="w-full border border-light-border dark:border-dark-border p-2 rounded bg-white dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 dark:bg-dark-border text-gray-800 dark:text-dark-text-primary px-4 py-2 rounded hover:opacity-80 transition"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="bg-light-primary dark:bg-dark-primary text-white px-4 py-2 rounded hover:opacity-90 transition"
                        >
                            Salva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
