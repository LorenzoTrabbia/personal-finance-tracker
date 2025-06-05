import { useEffect, useState } from "react";
import AddTransactionModal from "../components/AddTransactionModal";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { Transaction } from "../types/Transaction";
import greenDetail from "../assets/greenDetail.png";
import redDetail from "../assets/redDetail.png";
import BalanceCard from "../components/BalanceCard";
import FilterBar from "../components/FilterBar";

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
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyOutcome, setMonthlyOutcome] = useState(0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const availableYears = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))];

    const fetchTransactions = async (userId: string) => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "users", userId, "transactions"),
                orderBy("date", "desc")
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];

            let filtered = [...data];
            if (selectedCategory) filtered = filtered.filter(t => t.category === selectedCategory);
            if (selectedMonth) filtered = filtered.filter(t => new Date(t.date).getMonth() + 1 === parseInt(selectedMonth));
            if (selectedYear) filtered = filtered.filter(t => new Date(t.date).getFullYear() === parseInt(selectedYear));

            const sorted = filtered.sort((a, b) => {
                switch (sortBy) {
                    case "date_asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case "amount_asc": return a.amount - b.amount;
                    case "amount_desc": return b.amount - a.amount;
                    case "date_desc":
                    default: return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
            });

            setTransactions(sorted);
            setAvailableCategories(Array.from(new Set(data.map(t => t.category))));

            setBalance(data.reduce((acc, tx) => tx.type === "income" ? acc + tx.amount : acc - tx.amount, 0));

            setMonthlyIncome(
                data.filter(t => t.type === "income" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                    .reduce((acc, tx) => acc + tx.amount, 0)
            );

            setMonthlyOutcome(
                data.filter(t => t.type === "expense" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                    .reduce((acc, tx) => acc + tx.amount, 0)
            );

        } catch (error) {
            console.error("Errore nel recupero delle transazioni:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) fetchTransactions(user.uid);
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen, sortBy, selectedCategory, selectedMonth, selectedYear]);

    const userName = auth.currentUser?.displayName || "Utente";

    return (
        <div className="p-4 max-w-6xl mx-auto text-light-text-primary dark:text-dark-text-primary">
            <h1 className="text-3xl font-bold mb-6 text-light-primary dark:text-dark-primary">Benvenuto {userName}!</h1>

            <div className="flex flex-col gap-4 mb-6">
                {/* Balance card grande */}
                <BalanceCard
                    title="Current Balance"
                    value={balance}
                    image={balance >= 0 ? greenDetail : redDetail}
                    size="large"
                />

                {/* Container per le due small cards sotto */}
                <div className="flex gap-4 flex-wrap">
                    <BalanceCard
                        title="Monthly Income"
                        value={monthlyIncome}
                        image={greenDetail}
                        size="small"
                        gradient="green"
                    />
                    <BalanceCard
                        title="Monthly Outcome"
                        value={monthlyOutcome}
                        image={redDetail}
                        size="small"
                        gradient="red"
                    />
                </div>
            </div>


            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <FilterBar
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    availableCategories={availableCategories}
                    availableYears={availableYears}
                />

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold px-4 py-2 rounded-xl shadow hover:scale-105 transition-transform"
                >
                    + Aggiungi Transazione
                </button>

            </div>

            {loading ? (
                <p>Caricamento in corso...</p>
            ) : transactions.length === 0 ? (
                <p>Nessuna transazione trovata.</p>
            ) : (
                <ul className="space-y-2">
                    {transactions.map(tx => (
                        <li key={tx.id} className="p-3 rounded shadow-sm bg-light-background dark:bg-dark-background flex justify-between items-center">
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

            {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
