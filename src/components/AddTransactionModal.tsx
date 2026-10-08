import { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

// Types
import type { AddTransactionModalProps } from "../types/Props";

// Icons
import { Calendar, ChevronDown, X, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

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
    const [isSaving, setIsSaving] = useState(false);
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isSaving) onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isSaving, onClose]);

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

        setIsSaving(true);
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
        } catch (err: unknown) {
            console.error("Firestore Error:", err);
            setError("Error adding transaction. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSaving) onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-light-border bg-light-card p-6 shadow-2xl dark:border-dark-border dark:bg-dark-card sm:p-8"
                role="dialog"
                aria-modal="true"
                aria-labelledby="transaction-dialog-title"
                onMouseDown={(event) => event.stopPropagation()}
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 30, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <div className="mb-7 flex items-start justify-between gap-4">
                    <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-light-positive-value">Transactions</p><h2 id="transaction-dialog-title" className="text-2xl font-semibold tracking-tight text-light-text-primary dark:text-white">
                        {existingTransaction ? "Edit transaction" : "Add transaction"}
                    </h2><p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">Keep your financial activity up to date.</p></div>
                    <button type="button" onClick={onClose} disabled={isSaving} aria-label="Close dialog" className="rounded-xl p-2 text-slate-400 transition hover:bg-light-background hover:text-light-text-primary dark:hover:bg-dark-background dark:hover:text-white"><X className="h-5 w-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            aria-pressed={type === "income"}
                            className={`flex items-center justify-center gap-2 rounded-2xl border py-3 font-medium transition ${type === "income"
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                                : "border-light-border bg-transparent dark:border-dark-border"
                                }`}
                            onClick={() => setType("income")}
                        >
                            <ArrowDownCircle className="h-4 w-4" />
                            Income
                        </button>
                        <button
                            type="button"
                            aria-pressed={type === "expense"}
                            className={`flex items-center justify-center gap-2 rounded-2xl border py-3 font-medium transition ${type === "expense"
                                ? "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
                                : "border-light-border bg-transparent dark:border-dark-border"
                                }`}
                            onClick={() => setType("expense")}
                        >
                            <ArrowUpCircle className="h-4 w-4" />
                            Expense
                        </button>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (e.target.value.trim()) {
                                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                                }
                            }}
                            className={`h-12 w-full rounded-xl border bg-light-background px-4 text-sm text-light-text-primary outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:bg-dark-background dark:text-white ${fieldErrors.name ? "border-red-500" : "border-light-border dark:border-dark-border"
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
                        <label className="mb-2 block text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            min={0}
                            step="0.01"
                            inputMode="decimal"
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAmount(val);
                                if (val > 0) {
                                    setFieldErrors((prev) => ({ ...prev, amount: undefined }));
                                }
                            }}
                            className={`h-12 w-full rounded-xl border bg-light-background px-4 text-sm text-light-text-primary outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:bg-dark-background dark:text-white ${fieldErrors.amount ? "border-red-500" : "border-light-border dark:border-dark-border"
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
                        <label className="mb-2 block text-sm font-medium">
                            Category
                        </label>

                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    if (e.target.value.trim()) {
                                        setFieldErrors((prev) => ({ ...prev, category: undefined }));
                                    }
                                }}
                                className={`select-modern h-12 w-full px-4 pr-10 text-sm text-light-text-primary dark:text-white ${fieldErrors.category
                                    ? "border-red-500"
                                    : ""
                                    }`}
                            >
                                <option value="">Select category</option>
                                <option value="food">Food</option>
                                <option value="transport">Transport</option>
                                <option value="salary">Salary</option>
                                <option value="free time">Free Time</option>
                                <option value="other">Other</option>
                            </select>

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
                        <label className="mb-2 block text-sm font-medium">Date</label>
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
                            className={`select-modern h-12 w-full px-4 pr-10 text-sm text-light-text-primary dark:text-white ${fieldErrors.date ? "border-red-500" : ""
                                }`}
                        />
                        <Calendar
                            className="absolute right-3 top-9 h-5 w-5 cursor-pointer text-emerald-500"
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
                    <div className="mt-4 flex justify-between gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="h-12 w-full rounded-xl border border-light-border bg-light-card py-2 font-medium text-light-text-primary transition hover:bg-light-background dark:border-dark-border dark:bg-dark-card dark:text-white dark:hover:bg-dark-background"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="h-12 w-full rounded-xl bg-light-primary py-2 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-emerald-500 dark:text-dark-primary dark:hover:bg-emerald-400"
                        >
                            {isSaving ? "Saving..." : existingTransaction ? "Save" : "Add Transaction"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
