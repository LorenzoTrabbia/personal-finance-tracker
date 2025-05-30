import { useEffect, useState } from "react";
import AddTransactionModal from "../components/AddTransactionModal";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { Transaction } from "../types/Transaction";
import { months } from "../types/Months";

export default function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [sortBy, setSortBy] = useState("date_desc");
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const fetchTransactions = async (userId: string) => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "users", userId, "transactions"),
                orderBy("date", "desc")
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Transaction[];

            let filtered = [...data];

            if (selectedCategory) {
                filtered = filtered.filter(t => t.category === selectedCategory);
            }
            if (selectedMonth) {
                filtered = filtered.filter(t => new Date(t.date).getMonth() + 1 === parseInt(selectedMonth));
            }
            if (selectedYear) {
                filtered = filtered.filter(t => new Date(t.date).getFullYear() === parseInt(selectedYear));
            }

            const sorted = filtered.sort((a, b) => {
                switch (sortBy) {
                    case "date_asc":
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case "amount_asc":
                        return a.amount - b.amount;
                    case "amount_desc":
                        return b.amount - a.amount;
                    case "date_desc":
                    default:
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
            });

            setTransactions(sorted);

            const uniqueCategories = Array.from(new Set(data.map(t => t.category)));
            setAvailableCategories(uniqueCategories);

            const total = data.reduce((acc, tx) => {
                return tx.type === "income" ? acc + tx.amount : acc - tx.amount;
            }, 0);
            setBalance(total);
        } catch (error) {
            console.error("Errore nel recupero delle transazioni:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchTransactions(user.uid);
            }
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen, sortBy, selectedCategory, selectedMonth, selectedYear]);

    return (
        <div className="max-w-3xl mx-auto p-4 text-light-text-primary dark:text-dark-text-primary">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-light-primary dark:text-dark-primary">Dashboard</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-light-primary dark:bg-dark-primary text-white px-4 py-2 rounded hover:brightness-110 transition"
                >
                    + Aggiungi Transazione
                </button>
            </div>

            <div className="flex flex-wrap gap-4 items-center mb-4">
                <div>
                    <label className="text-sm font-medium mr-2">Ordina per:</label>
                    <select
                        className="border rounded px-2 py-1 bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date_desc">Data (più recente)</option>
                        <option value="date_asc">Data (meno recente)</option>
                        <option value="amount_desc">Importo (decrescente)</option>
                        <option value="amount_asc">Importo (crescente)</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium mr-2">Categoria:</label>
                    <select
                        className="border rounded px-2 py-1 bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Tutte</option>
                        {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium mr-2">Mese:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border p-2 rounded bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                    >
                        <option value="">Tutti i mesi</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium mr-2">Anno:</label>
                    <select
                        className="border rounded px-2 py-1 bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Tutti</option>
                        {[...new Set(transactions.map(t => new Date(t.date).getFullYear()))].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="bg-light-secondary dark:bg-dark-secondary text-light-text-primary dark:text-dark-text-primary hover:brightness-110 text-sm px-3 py-1 rounded"
                    onClick={() => {
                        setSelectedCategory("");
                        setSelectedMonth("");
                        setSelectedYear("");
                    }}
                >
                    Reset filtri
                </button>
            </div>

            <div className="mb-4 text-xl font-semibold">
                Saldo:{" "}
                <span className={balance >= 0 ? "text-light-positive-value dark:text-dark-positive-value" : "text-light-negative-value dark:text-dark-negative-value"}>
                    €{balance.toFixed(2)}
                </span>
            </div>

            {loading ? (
                <p>Caricamento in corso...</p>
            ) : transactions.length === 0 ? (
                <p>Nessuna transazione trovata.</p>
            ) : (
                <ul className="space-y-2">
                    {transactions.map(tx => (
                        <li key={tx.id} className="border rounded p-3 flex justify-between items-center bg-light-background dark:bg-dark-background">
                            <div>
                                <p className="font-medium">{tx.name}</p>
                                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                    {new Date(tx.date).toLocaleDateString()} • {tx.category}
                                </p>
                            </div>
                            <div className={`font-bold ${tx.type === "income" ? "text-light-positive-value dark:text-dark-positive-value" : "text-light-negative-value dark:text-dark-negative-value"}`}>
                                {tx.type === "income" ? "+" : "-"}€{tx.amount.toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <AddTransactionModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}
