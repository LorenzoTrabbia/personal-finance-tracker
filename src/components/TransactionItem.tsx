import { useEffect, useRef, useState } from "react";

// Types
import type { TransactionItemProps } from "../types/Props";

// Icons
import { ArrowDown, ArrowUp, EllipsisVertical, Pencil, Trash2 } from "lucide-react";

export default function TransactionItem({ transaction, onEdit, onDelete, currency }: TransactionItemProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isIncome = transaction.type === "income";
    const amountColor = isIncome
        ? "text-light-positive-value dark:text-dark-positive-value"
        : "text-light-negative-value dark:text-dark-negative-value";

    const Icon = isIncome ? ArrowDown : ArrowUp;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <li className={`group relative flex flex-col gap-3 rounded-2xl border border-light-border/70 bg-light-card px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-dark-border/70 dark:bg-dark-background/60 dark:hover:border-emerald-900 sm:flex-row sm:items-center sm:justify-between ${menuOpen ? "z-30" : "z-0"}`}>
            {/* Icon + name + date + category */}
            <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ${isIncome ? "bg-emerald-50 dark:bg-emerald-950/40" : "bg-red-50 dark:bg-red-950/30"}`}>
                    <Icon className={`w-4 h-4 ${amountColor}`} />
                </div>
                <div className="flex flex-col text-sm">
                    <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">{transaction.name}</span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span className="rounded-full bg-slate-200 px-2 py-1 font-medium dark:bg-slate-700">
                            {transaction.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* Amount + actions menu */}
            <div className="flex items-center gap-2 relative" ref={menuRef}>
                <div className={`text-sm font-semibold ${amountColor}`}>
                    {isIncome ? "+" : "-"}{currency}{transaction.amount.toFixed(2)}
                </div>

                {/* Actions button */}
                <button
                    onClick={() => setMenuOpen((open: boolean) => !open)}
                    className="sm:static absolute bottom-0 right-0 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer p-1 rounded"
                    aria-label="Open actions menu"
                >
                    <EllipsisVertical className="w-5 h-5" />
                </button>

                {/* Menu */}
                {menuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-28 overflow-hidden rounded-xl border border-light-border bg-light-card shadow-xl shadow-slate-900/15 dark:border-dark-border dark:bg-dark-card">
                        <button
                            onClick={() => {
                                onEdit?.(transaction);
                                setMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-t-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                onDelete?.(transaction);
                                setMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-b-md text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
}
