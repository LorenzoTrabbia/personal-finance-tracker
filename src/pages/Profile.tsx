import { useContext, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AppContext } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';

// Types
import type { Goal, NewGoal } from '../types/Goal';

// Icons
import { User, Mail, Currency, BarChart2, ArrowDownCircle, ArrowUpCircle, Goal as GoalIcon, PlusCircle, Settings, FileDown, Trash2, List } from 'lucide-react';
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2 py-10 px-8 mx-auto">
            {/* User Info */}
            <div className="text-light-text-primary dark:text-dark-text-primary bg-light-card dark:bg-dark-card rounded-2xl p-6 shadow-sm transition duration-300">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-400" />
                    User Information
                </h2>
                <p className="mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> <strong>Email:</strong> {user.email}
                </p>
                <p className="flex items-center gap-2">
                    <Currency className="w-4 h-4" /> <strong>Preferred currency:</strong> {currency}
                </p>
            </div>

            {/* Stats */}
            <div className="text-light-text-primary dark:text-dark-text-primary bg-light-card dark:bg-dark-card rounded-2xl p-6 shadow-sm transition duration-300">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-blue-400" /> Statistics
                </h2>
                <p className="mb-2 flex items-center gap-2">
                    <List className="w-4 h-4" /> <strong>Total Transactions:</strong> {transactions.length}
                </p>
                <p className="mb-2 flex items-center gap-2">
                    <ArrowDownCircle className="w-4 h-4" /> <strong>Income:</strong> {currency}{totalIncome}
                </p>
                <p className="flex items-center gap-2">
                    <ArrowUpCircle className="w-4 h-4" /> <strong>Expense:</strong> {currency}{totalExpense}
                </p>
            </div>

            {/* Goals */}
            <div className="text-light-text-primary dark:text-dark-text-primary bg-light-card dark:bg-dark-card rounded-2xl p-6 shadow-sm col-span-full transition duration-300">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <GoalIcon className="w-6 h-6 text-blue-400" /> Saving Targets
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
                            className={`border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} p-2 rounded-lg w-full text-light-text-primary dark:text-dark-text-primary transition duration-300`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder={`Target (${currency})`}
                            value={newGoal.target}
                            onChange={e => handleChange('target', e.target.value)}
                            className={`border ${errors.target ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} p-2 rounded-lg w-full text-light-text-primary dark:text-dark-text-primary transition duration-300`}
                        />
                        {errors.target && <p className="text-red-500 text-sm mt-1">{errors.target}</p>}
                    </div>
                </div>
                <button
                    onClick={handleAddGoal}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> Add Target
                </button>
            </div>

            {/* Export / Reset */}
            <div className="text-light-text-primary dark:text-dark-text-primary bg-light-card dark:bg-dark-card rounded-2xl p-6 shadow-sm col-span-full transition duration-300">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Export or Reset Data
                </h2>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={handleExportCSV}
                        className="bg-green-600 hover:bg-green-700 text-dark-text-primary px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"
                    >
                        <FileDown className="w-4 h-4" /> Export CSV
                    </button>
                    <button
                        onClick={() => setConfirmDialogOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-dark-text-primary px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" /> Reset Data
                    </button>
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