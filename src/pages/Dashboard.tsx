import { useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
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

// Context
import { useAppContext } from "../context/useAppContext";

export default function Dashboard() {
    const { currency, userName, transactions, fetchTransactions, loadingTransactions } = useAppContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    const [sortBy, setSortBy] = useState("date_desc");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    // Date helpers
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtered, Sorted Transactions (Memoized)
    const filteredTransactions = useMemo(() => {
        let filtered = [...transactions];
        if (selectedCategory) {
            filtered = filtered.filter(t => t.category === selectedCategory);
        }
        if (selectedMonth) {
            filtered = filtered.filter(t => new Date(t.date).getMonth() + 1 === parseInt(selectedMonth));
        }
        if (selectedYear) {
            filtered = filtered.filter(t => new Date(t.date).getFullYear() === parseInt(selectedYear));
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "date_asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
                case "amount_asc": return a.amount - b.amount;
                case "amount_desc": return b.amount - a.amount;
                case "date_desc":
                default: return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
        });
    }, [transactions, selectedCategory, selectedMonth, selectedYear, sortBy]);

    // Categories & Years
    const availableCategories = useMemo(
        () => Array.from(new Set(transactions.map(t => t.category))),
        [transactions]
    );
    const availableYears = useMemo(
        () => Array.from(new Set(transactions.map(t => new Date(t.date).getFullYear()))),
        [transactions]
    );

    // Calculations
    const balance = useMemo(() =>
        transactions.reduce((acc, tx) =>
            tx.type === "income" ? acc + tx.amount : acc - tx.amount, 0),
        [transactions]
    );

    const monthlyIncome = useMemo(() =>
        transactions
            .filter(t =>
                t.type === "income" &&
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear
            )
            .reduce((acc, tx) => acc + tx.amount, 0),
        [transactions, currentMonth, currentYear]
    );

    const monthlyOutcome = useMemo(() =>
        transactions
            .filter(t =>
                t.type === "expense" &&
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear
            )
            .reduce((acc, tx) => acc + tx.amount, 0),
        [transactions, currentMonth, currentYear]
    );

    // Actions
    const handleSaveSuccess = () => {
        fetchTransactions();
    };

    const handleDelete = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
    };

    const handleConfirmDelete = async () => {
        if (!transactionToDelete) return;

        const user = auth.currentUser;
        if (user) {
            const transactionRef = doc(db, "users", user.uid, "transactions", transactionToDelete.id);
            await deleteDoc(transactionRef);
            fetchTransactions();
            setTransactionToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setTransactionToDelete(null);
    };

    return (
        <div className="p-10 max-w-6xl mx-auto text-light-text-primary dark:text-dark-text-primary">
            <h1 className="text-4xl font-semibold mb-10 text-light-primary dark:text-dark-text-primary">
                {userName ? `Welcome, ${userName}!` : "Welcome!"}
            </h1>

            {/* Balance Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <BalanceCard title="Total Balance" value={balance} style="reverse" currency={currency} />
                <BalanceCard title="Monthly Income" value={monthlyIncome} currency={currency} />
                <BalanceCard title="Monthly Outcome" value={monthlyOutcome} currency={currency} />
            </div>

            {/* Filters and Add Button */}
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
                    disabled={loadingTransactions || transactions.length === 0}
                />
                <AddTransactionButton onClick={() => setIsModalOpen(true)} />
            </div>

            {/* Sort By */}
            <SortBy
                sortBy={sortBy}
                setSortBy={setSortBy}
                disabled={loadingTransactions || transactions.length === 0}
            />

            {/* Transactions */}
            {loadingTransactions ? (
                <Spinner />
            ) : filteredTransactions.length === 0 ? (
                <EmptyState />
            ) : (
                <ul className="space-y-2">
                    {filteredTransactions.map(tx => (
                        <TransactionItem
                            key={tx.id}
                            transaction={tx}
                            onEdit={setEditingTransaction}
                            onDelete={handleDelete}
                            currency={currency}
                        />
                    ))}
                </ul>
            )}

            {/* Modals */}
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
