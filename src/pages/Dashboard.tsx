import { useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";

// Types
import type { Transaction } from "../types/Transaction";
import type { SortOption } from "../types/Props";

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
    const { currency, userName, transactions, fetchTransactions, loadingTransactions, transactionError } = useAppContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    const [sortBy, setSortBy] = useState<SortOption>("date_desc");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

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
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
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
    }, [transactions, selectedCategory, selectedMonth, selectedYear, sortBy, searchQuery]);


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
            setIsDeleting(true);
            setDeleteError("");
            try {
                const transactionRef = doc(db, "users", user.uid, "transactions", transactionToDelete.id);
                await deleteDoc(transactionRef);
                await fetchTransactions();
                setTransactionToDelete(null);
            } catch (error) {
                console.error("Failed to delete transaction:", error);
                setDeleteError("We couldn't delete this transaction. Please try again.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setTransactionToDelete(null);
    };

    return (
        <div className="mx-auto max-w-7xl px-5 py-8 text-light-text-primary transition duration-300 dark:text-dark-text-primary sm:px-8 lg:px-10 lg:py-10">
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-dark-primary px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-8">
                <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
                <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Overview</p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            {userName ? `Welcome back, ${userName}` : "Welcome back"}
                        </h1>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">Here’s your financial picture at a glance. Keep building a clearer relationship with your money.</p>
                    </div>
                    <AddTransactionButton onClick={() => setIsModalOpen(true)} />
                </div>
            </div>

            {/* Balance Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <BalanceCard title="Total Balance" value={balance} style="reverse" currency={currency} />
                <BalanceCard title="Monthly Income" value={monthlyIncome} currency={currency} />
                <BalanceCard title="Monthly Outcome" value={monthlyOutcome} currency={currency} />
            </div>

            {/* Filters and Add Button */}
            <div className="mb-5 rounded-3xl border border-light-border bg-light-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
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
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SortBy sortBy={sortBy} setSortBy={setSortBy} disabled={loadingTransactions || transactions.length === 0} />
                <input
                    type="text"
                    aria-label="Search transactions by name"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-xl border border-light-border bg-light-card px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-dark-border dark:bg-dark-card sm:max-w-xs"
                />
            </div>

            {/* Transactions */}
            <section className="rounded-3xl border border-light-border bg-light-card p-4 shadow-sm dark:border-dark-border dark:bg-dark-card sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div><h2 className="text-lg font-semibold">Recent transactions</h2><p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{filteredTransactions.length} activity items</p></div>
                </div>
                {loadingTransactions ? <Spinner /> : transactionError ? (
                    <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950/30 dark:text-red-300">{transactionError}</p>
                ) : filteredTransactions.length === 0 ? <EmptyState isSearching={searchQuery.trim() !== ""} /> : (
                    <ul className="space-y-3">
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
            </section>

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
                confirmDisabled={isDeleting}
            />
            {deleteError && <p role="alert" className="mt-4 text-sm text-red-600">{deleteError}</p>}
        </div>
    );
}
