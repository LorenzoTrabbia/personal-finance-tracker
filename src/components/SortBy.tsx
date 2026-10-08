// Icons
import { ArrowDownUp } from 'lucide-react';

// Types
import type { SortByProps } from "../types/Props"
import type { SortOption } from "../types/Props"

const sortOptions: SortOption[] = ["date_desc", "date_asc", "amount_desc", "amount_asc"];

function isSortOption(value: string): value is SortOption {
    return sortOptions.includes(value as SortOption);
}

export default function SortBy({ sortBy, setSortBy, disabled = false }: SortByProps) {
    return (
        <div
            className={`relative mb-2 w-fit rounded-xl ${disabled
                ? 'text-gray-400 cursor-not-allowed'
                : ''
                }`}
        >
            <div className={`pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 ${disabled ? 'cursor-not-allowed' : 'text-gray-500 dark:text-gray-400'
                }`}>
                <ArrowDownUp className="h-4 w-4" />
            </div>
            <select
                value={sortBy}
                onChange={(e) => {
                    if (isSortOption(e.target.value)) setSortBy(e.target.value);
                }}
                disabled={disabled}
                className={`select-modern h-11 w-full pl-10 pr-4 text-sm text-gray-500 dark:text-gray-400
                            ${disabled
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer'}
                `}
            >
                <option value="date_desc">Date (Newest)</option>
                <option value="date_asc">Date (Oldest)</option>
                <option value="amount_desc">Amount (High to Low)</option>
                <option value="amount_asc">Amount (Low to High)</option>
            </select>
        </div>
    )
}