import { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

// Types
import type { AddTransactionModalProps } from "../types/Props";

// Icons
import { Calendar, ChevronDown } from "lucide-react";

export default function AddTransactionModal({
    onClose,
    existingTransaction,
    onSaveSuccess,
}: AddTransactionModalProps) {
    const [type, setType] = useState<"income" | "expense">("income");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{
        name?: string;
        amount?: string;
        category?: string;
        date?: string;
    }>({});

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (existingTransaction) {
            setType(existingTransaction.type);
            setName(existingTransaction.name);
            setAmount(existingTransaction.amount);
            setCategory(existingTransaction.category);
            setDate(existingTransaction.date.slice(0, 10));
        } else {
            setType("income");
            setName("");
            setAmount(0);
            setCategory("");
            setDate(new Date().toISOString().slice(0, 10));
        }
    }, [existingTransaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        const newErrors: typeof fieldErrors = {};
        if (!name.trim()) newErrors.name = "Required field";
        if (!amount || amount <= 0) newErrors.amount = "Amount must be greater than 0";
        if (!category.trim()) newErrors.category = "Required field";
        if (!date) newErrors.date = "Required field";

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setError("Utente non autenticato.");
            return;
        }

        const transactionData = {
            type,
            name,
            amount: parseFloat(amount.toString()),
            category,
            date,
            updatedAt: serverTimestamp(),
        };

        try {
            if (existingTransaction) {
                await setDoc(
                    doc(db, "users", user.uid, "transactions", existingTransaction.id),
                    { ...transactionData, createdAt: existingTransaction.createdAt || serverTimestamp() }
                );
            } else {
                await addDoc(collection(db, "users", user.uid, "transactions"), {
                    ...transactionData,
                    createdAt: serverTimestamp(),
                });
            }

            if (onSaveSuccess) onSaveSuccess();
            onClose();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Firestore Error:", err);
            setError("Error adding transaction. Please try again.");
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-full max-w-lg rounded-2xl bg-white dark:bg-dark-background p-6 shadow-xl"
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 30, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    {existingTransaction ? "Edit Transaction" : "Add Transaction"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg border ${type === "income"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-transparent border-gray-300 dark:border-gray-600"
                                }`}
                            onClick={() => setType("income")}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg border ${type === "expense"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : "bg-transparent border-gray-300 dark:border-gray-600"
                                }`}
                            onClick={() => setType("expense")}
                        >
                            Expense
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (e.target.value.trim()) {
                                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                                }
                            }}
                            className={`w-full rounded-lg border p-2 bg-white dark:bg-dark-background text-gray-900 dark:text-white ${fieldErrors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            placeholder="Ex. Groceries"
                        />
                        <AnimatePresence mode="wait" initial={false}>
                            {fieldErrors.name && (
                                <motion.p
                                    key="error-name"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm text-red-600 mt-1"
                                >
                                    {fieldErrors.name}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            min={0}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAmount(val);
                                if (val > 0) {
                                    setFieldErrors((prev) => ({ ...prev, amount: undefined }));
                                }
                            }}
                            className={`w-full rounded-lg border p-2 bg-white dark:bg-dark-background text-gray-900 dark:text-white ${fieldErrors.amount ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            placeholder="€0.00"
                        />
                        <AnimatePresence mode="wait" initial={false}>
                            {fieldErrors.amount && (
                                <motion.p
                                    key="error-amount"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm text-red-600 mt-1"
                                >
                                    {fieldErrors.amount}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>

                        {/* Wrapper isolato per select + icona */}
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    if (e.target.value.trim()) {
                                        setFieldErrors((prev) => ({ ...prev, category: undefined }));
                                    }
                                }}
                                className={`w-full appearance-none rounded-lg border p-2 pr-10 bg-white dark:bg-dark-background text-gray-900 dark:text-white ${fieldErrors.category
                                    ? "border-red-500"
                                    : "border-gray-300 dark:border-gray-600"
                                    }`}
                            >
                                <option value="">Select category</option>
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                                <option value="salary">Salary</option>
                                <option value="free time">Free Time</option>
                                <option value="other">Other</option>
                            </select>

                            {/* Freccetta custom */}
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            {fieldErrors.category && (
                                <motion.p
                                    key="error-category"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm text-red-600 mt-1"
                                >
                                    {fieldErrors.category}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Date */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                        <input
                            ref={inputRef}
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                if (e.target.value) {
                                    setFieldErrors((prev) => ({ ...prev, date: undefined }));
                                }
                            }}
                            className={`w-full appearance-none rounded-lg border p-2 pr-10 bg-white dark:bg-dark-background text-gray-900 dark:text-white ${fieldErrors.date ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                        />
                        <Calendar
                            className="absolute right-3 top-9 w-5 h-5 text-blue-500 cursor-pointer"
                            onClick={() => inputRef.current?.showPicker?.()}
                        />
                        <AnimatePresence mode="wait" initial={false}>
                            {fieldErrors.date && (
                                <motion.p
                                    key="error-date"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-sm text-red-600 mt-1"
                                >
                                    {fieldErrors.date}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Error */}
                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full mr-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-border text-gray-800 dark:text-white py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full ml-2 rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700 transition"
                        >
                            {existingTransaction ? "Save" : "Add Transaction"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
