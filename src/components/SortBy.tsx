// Icons
import { ArrowDownUp } from 'lucide-react';

// Types
import type { SortByProps } from "../types/Props"

export default function SortBy({ sortBy, setSortBy, disabled = false }: SortByProps) {
    return (
        <div
            className={`relative w-fit mb-2 rounded-md ${disabled
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
                onChange={(e) => setSortBy(e.target.value)}
                disabled={disabled}
                className={`appearance-none w-full pl-10 rounded-md border border-transparent text-gray-500 dark:text-gray-400
                            focus:outline-none focus:border-transparent
                            ${disabled
                        ? 'cursor-not-allowed'
                        : 'dark:bg-dark-primary-background cursor-pointer'}
                `}
            >
                <option value="date_desc" className='dark:text-light-text-primary'>Date (Newest)</option>
                <option value="date_asc" className='dark:text-light-text-primary'>Date (Oldest)</option>
                <option value="amount_desc" className='dark:text-light-text-primary'>Amount (High to Low)</option>
                <option value="amount_asc" className='dark:text-light-text-primary'>Amount (Low to High)</option>
            </select>
        </div>
    )
}