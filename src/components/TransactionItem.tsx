// Types
import type { TransactionItemProps } from "../types/Props";


export default function TransactionItem({ transaction }: TransactionItemProps) {
    return (
        <li className="p-3 rounded shadow-sm bg-light-background dark:bg-dark-background flex justify-between items-center">
            <div>
                <p className="font-medium">{transaction.name}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                </p>
            </div>
            <div
                className={`font-bold ${transaction.type === "income"
                    ? "text-light-positive-value dark:text-dark-positive-value"
                    : "text-light-negative-value dark:text-dark-negative-value"
                    }`}
            >
                {transaction.type === "income" ? "+" : "-"}€{transaction.amount.toFixed(2)}
            </div>
        </li>
    );
}