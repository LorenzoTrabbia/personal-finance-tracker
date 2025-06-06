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
        ? "text-green-500 dark:text-green-400"
        : "text-red-500 dark:text-red-400";

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
        <li className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white dark:bg-dark-card rounded-xl px-4 py-3 shadow-sm">
            {/* Icon + name + date + category */}
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <Icon className={`w-4 h-4 ${amountColor}`} />
                </div>
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">{transaction.name}</span>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
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
                    <div className="absolute right-0 top-full mt-2 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 ">
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


