import { useContext, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AppContext } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';

// Types
import type { Goal, NewGoal } from '../types/Goal';

// Icons
import { User, Mail, Component, BarChart2, ArrowDownCircle, ArrowUpCircle, Goal as GoalIcon, PlusCircle, Settings, FileDown, Trash2, List } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

const Profile = () => {
    const { transactions, currency, fetchTransactions } = useContext(AppContext);
    const user = auth.currentUser!;
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoal, setNewGoal] = useState<NewGoal>({ name: '', target: '' });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [errors, setErrors] = useState({ name: '', target: '' });

    const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);

    useEffect(() => {
        const fetchGoals = async () => {
            const goalsRef = collection(db, 'users', user.uid, 'goals');
            const snapshot = await getDocs(goalsRef);
            const goalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
            setGoals(goalsData);
        };

        fetchGoals();
    }, [user.uid]);

    const handleAddGoal = async () => {
        let hasError = false;
        const newErrors = { name: '', target: '' };

        if (!newGoal.name.trim()) {
            newErrors.name = 'Please enter a target name.';
            hasError = true;
        }
        if (!newGoal.target.trim() || isNaN(Number(newGoal.target)) || Number(newGoal.target) <= 0) {
            newErrors.target = 'Please enter a valid target amount.';
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        const goalRef = doc(collection(db, 'users', user.uid, 'goals'));
        const goalData = {
            name: newGoal.name.trim(),
            target: Number(newGoal.target)
        };

        await setDoc(goalRef, goalData);
        setGoals([...goals, { id: goalRef.id, ...goalData }]);
        setNewGoal({ name: '', target: '' });
        setErrors({ name: '', target: '' });
    };

    const handleDeleteGoal = async (id: string) => {
        await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const handleResetData = async () => {
        setConfirmDialogOpen(false);
        try {
            const transactionsRef = collection(db, 'users', user.uid, 'transactions');
            const transactionsSnapshot = await getDocs(transactionsRef);
            const deleteTransactions = transactionsSnapshot.docs.map(docItem => deleteDoc(doc(db, 'users', user.uid, 'transactions', docItem.id)));

            const goalsRef = collection(db, 'users', user.uid, 'goals');
            const goalsSnapshot = await getDocs(goalsRef);
            const deleteGoals = goalsSnapshot.docs.map(docItem => deleteDoc(doc(db, 'users', user.uid, 'goals', docItem.id)));

            const preferencesRef = doc(db, 'users', user.uid, 'preferences', 'settings');
            await deleteDoc(preferencesRef);

            await Promise.all([...deleteTransactions, ...deleteGoals]);

            setGoals([]);

            fetchTransactions();

            setShowSnackbar(true);
            setTimeout(() => setShowSnackbar(false), 3000);
        } catch (error) {
            console.error("Error deleting data: ", error);
            alert("An error occurred while deleting your data.");
        }
    };

    const handleChange = (field: 'name' | 'target', value: string) => {
        setNewGoal({ ...newGoal, [field]: value });
        setErrors({ ...errors, [field]: '' }); // cancella errore appena scrivi
    };

    const handleExportCSV = () => {
        if (transactions.length === 0) {
            alert("No transactions to export.");
            return;
        }

        const headers = ['Date', 'Type', 'Amount', 'Category', 'Description'];
        const rows = transactions.map(tx => [
            tx.date,
            tx.type,
            tx.amount,
            tx.category,
            tx.name || ''
        ]);

        const csvContent =
            headers.join(';') + '\n' +
            rows.map(row => row.join(';')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="mx-auto max-w-7xl px-5 py-8 text-light-text-primary dark:text-dark-text-primary sm:px-8 lg:px-10 lg:py-10">
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-dark-primary px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
                <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="relative">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Your space</p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Profile</h1>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">A snapshot of your financial activity, goals, and progress.</p>
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                {/* User Info */}
                <div className="rounded-3xl border border-light-border bg-light-card p-6 shadow-sm transition duration-300 dark:border-dark-border dark:bg-dark-card">
                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                        <User className="h-5 w-5 text-emerald-500" />
                        User Information
                    </h2>
                    <p className="mb-4 flex items-center gap-3 rounded-2xl bg-light-background p-3 text-sm dark:bg-dark-background">
                        <Mail className="h-4 w-4 text-emerald-500" /> <span><strong className="mr-1">Email</strong> {user.email}</span>
                    </p>
                    <p className="flex items-center gap-3 rounded-2xl bg-light-background p-3 text-sm dark:bg-dark-background">
                        <Component className="h-4 w-4 text-emerald-500" /> <span><strong className="mr-1">Currency</strong> {currency || "Not set"}</span>
                    </p>
                </div>

                {/* Stats */}
                <div className="rounded-3xl border border-light-border bg-light-card p-6 shadow-sm transition duration-300 dark:border-dark-border dark:bg-dark-card">
                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                        <BarChart2 className="h-5 w-5 text-emerald-500" /> Statistics
                    </h2>
                    <p className="mb-3 flex items-center justify-between rounded-2xl bg-light-background p-3 text-sm dark:bg-dark-background">
                        <span className="flex items-center gap-2"><List className="h-4 w-4 text-emerald-500" /> Total transactions</span><strong>{transactions.length}</strong>
                    </p>
                    <p className="mb-3 flex items-center justify-between rounded-2xl bg-emerald-50 p-3 text-sm dark:bg-emerald-950/30">
                        <span className="flex items-center gap-2"><ArrowDownCircle className="h-4 w-4 text-emerald-500" /> Income</span><strong>{currency}{totalIncome.toFixed(2)}</strong>
                    </p>
                    <p className="flex items-center justify-between rounded-2xl bg-red-50 p-3 text-sm dark:bg-red-950/30">
                        <span className="flex items-center gap-2"><ArrowUpCircle className="h-4 w-4 text-red-500" /> Expense</span><strong>{currency}{totalExpense.toFixed(2)}</strong>
                    </p>
                </div>

                {/* Goals */}
                <div className="rounded-3xl border border-light-border bg-light-card p-6 shadow-sm transition duration-300 dark:border-dark-border dark:bg-dark-card lg:col-span-2">
                    <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                        <GoalIcon className="h-5 w-5 text-emerald-500" /> Saving targets
                    </h2>

                    {goals.length === 0 && (
                        <p className="text-gray-500 italic mb-4">No target yet. Add one below!</p>
                    )}

                    {goals.map(goal => {
                        const progress = Math.min(((totalIncome - totalExpense) / goal.target) * 100, 100);
                        return (
                            <div key={goal.id} className="mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-medium">
                                        {goal.name} — <span className="text-sm text-gray-500">Target: {currency}{goal.target}</span>
                                    </p>
                                    <span className="text-sm text-gray-600">{Math.floor(progress)}%</span>
                                </div>
                                <div className="w-full bg-light-secondary-background dark:bg-dark-secondary-background rounded-full h-3 transition duration-300">
                                    <div
                                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <button
                                    onClick={() => handleDeleteGoal(goal.id)}
                                    className="mt-2 text-sm text-light-negative-value dark:text-dark-negative-value hover:underline"
                                >
                                    Delete target
                                </button>
                            </div>
                        );
                    })}

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <input
                                placeholder="Target Name"
                                value={newGoal.name}
                                onChange={e => handleChange('name', e.target.value)}
                                className={`h-12 w-full rounded-xl border bg-light-background px-4 text-sm text-light-text-primary transition duration-300 dark:bg-dark-background dark:text-dark-text-primary ${errors.name ? 'border-red-500' : 'border-light-border dark:border-dark-border'}`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder={`Target (${currency})`}
                                value={newGoal.target}
                                onChange={e => handleChange('target', e.target.value)}
                                className={`h-12 w-full rounded-xl border bg-light-background px-4 text-sm text-light-text-primary transition duration-300 dark:bg-dark-background dark:text-dark-text-primary ${errors.target ? 'border-red-500' : 'border-light-border dark:border-dark-border'}`}
                            />
                            {errors.target && <p className="text-red-500 text-sm mt-1">{errors.target}</p>}
                        </div>
                    </div>
                    <button
                        onClick={handleAddGoal}
                        className="mt-4 flex h-11 items-center gap-2 rounded-xl bg-light-primary px-4 font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-dark-primary dark:hover:bg-emerald-400"
                    >
                        <PlusCircle className="w-4 h-4" /> Add Target
                    </button>
                </div>

                {/* Export / Reset */}
                <div className="rounded-3xl border border-light-border bg-light-card p-6 text-light-text-primary shadow-sm transition duration-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-primary lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Export or Reset Data
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleExportCSV}
                            className="flex h-11 items-center gap-2 rounded-xl bg-light-primary px-4 font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-dark-primary dark:hover:bg-emerald-400"
                        >
                            <FileDown className="w-4 h-4" /> Export CSV
                        </button>
                        <button
                            onClick={() => setConfirmDialogOpen(true)}
                            className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-4 font-semibold text-white transition hover:bg-red-700"
                        >
                            <Trash2 className="w-4 h-4" /> Reset Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirl Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                title="Delete Data"
                description="Are you sure you want to permanently delete all your data? This action cannot be undone."
                onConfirm={handleResetData}
                onCancel={() => setConfirmDialogOpen(false)}
            />

            {/* Snackbar for feedback */}
            <AnimatePresence>
                {showSnackbar && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
                    >
                        Data successfully deleted!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;