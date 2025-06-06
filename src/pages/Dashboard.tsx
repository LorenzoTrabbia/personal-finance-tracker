import { useCallback, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";

// Types
import type { Transaction } from "../types/Transaction";

// Components
import AddTransactionModal from "../components/AddTransactionModal";
import BalanceCard from "../components/BalanceCard";
import FilterBar from "../components/FilterBar";
import TransactionItem from "../components/TransactionItem";
import AddTransactionButton from "../components/AddTransactionButton";
import SortBy from "../components/SortBy";
import ConfirmDialog from "../components/ConfirmDialog";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    // Modal and transaction state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Balance and monthly calculations
    const [balance, setBalance] = useState(0);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyOutcome, setMonthlyOutcome] = useState(0);

    // Filters
    const [sortBy, setSortBy] = useState("date_desc");
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    // Date filters
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

    const fetchTransactionsMemoized = useCallback(() => {
        const user = auth.currentUser;
        if (user) fetchTransactions(user.uid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, selectedMonth, selectedYear, sortBy]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) fetchTransactions(user.uid);
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, selectedCategory, selectedMonth, selectedYear]);

    useEffect(() => {
        fetchTransactionsMemoized();
    }, [fetchTransactionsMemoized]);

    const handleSaveSuccess = () => {
        fetchTransactionsMemoized();
    };

    const handleDelete = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
    };

    const handleConfirmDelete = () => {
        if (!transactionToDelete) return;

        const user = auth.currentUser;
        if (user) {
            const transactionRef = doc(db, "users", user.uid, "transactions", transactionToDelete.id);
            deleteDoc(transactionRef)
                .then(() => {
                    console.log("Transaction deleted successfully");
                    fetchTransactionsMemoized();
                    setTransactionToDelete(null);
                })
                .catch((error) => {
                    console.error("Error deleting transaction:", error);
                    setTransactionToDelete(null);
                });
        }
    };

    const handleCancelDelete = () => {
        setTransactionToDelete(null);
    };

    const userName = auth.currentUser?.displayName || "";

    return (
        <div className="p-10 max-w-6xl mx-auto text-light-text-primary dark:text-dark-text-primary">
            <h1 className="text-4xl font-semibold mb-10 text-light-primary dark:text-dark-text-primary">
                {userName ? `Welcome, ${userName}!` : "Welcome!"}
            </h1>

            {/* Balance Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <BalanceCard
                    title="Total Balance"
                    value={balance}
                    style="reverse"
                />

                <BalanceCard
                    title="Monthly Income"
                    value={monthlyIncome}
                />
                <BalanceCard
                    title="Monthly Outcome"
                    value={monthlyOutcome}
                />
            </div>

            {/* Filters and Add Transaction Button */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <FilterBar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    availableCategories={availableCategories}
                    availableYears={availableYears}
                    disabled={loading || transactions.length === 0}
                />

                <AddTransactionButton
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            {/* Sort By */}
            <SortBy
                sortBy={sortBy}
                setSortBy={setSortBy}
                disabled={loading || transactions.length === 0}
            />

            {/* Transaction List */}
            {loading ? (
                <Spinner />
            ) : transactions.length === 0 ? (
                <EmptyState />
            ) : (
                <ul className="space-y-2">
                    {transactions.map(tx => (
                        <TransactionItem
                            key={tx.id}
                            transaction={tx}
                            onEdit={setEditingTransaction}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}

            {/* Transaction Modal */}
            <AnimatePresence>
                {(isModalOpen || editingTransaction) && (
                    <AddTransactionModal
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingTransaction(null);
                        }}
                        existingTransaction={editingTransaction}
                        onSaveSuccess={handleSaveSuccess}
                    />
                )}
            </AnimatePresence>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={!!transactionToDelete}
                title="Delete Transaction"
                description={`Are you sure you want to delete "${transactionToDelete?.name}"?`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}
