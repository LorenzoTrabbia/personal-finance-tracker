// Icons
import { ArrowDownUp } from 'lucide-react';

// Types
import type { SortByProps } from "../types/Props"

export default function SortBy({ sortBy, setSortBy }: SortByProps) {
    return (
        <div className="relative w-fit mb-2 rounded-md hover:bg-gray-100 hover:dark:bg-gray-700 
        transition-colors duration-200 ease-in-out">
            <div className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ArrowDownUp className="h-4 w-4" />
            </div>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full pl-10 rounded-md border border-transparent text-gray-500 dark:text-gray-400
            focus:outline-none focus:border-transparent"
            >
                <option value="date_desc" className='dark:text-light-text-primary'>Date (Newest)</option>
                <option value="date_asc" className='dark:text-light-text-primary'>Date (Oldest)</option>
                <option value="amount_desc" className='dark:text-light-text-primary'>Amount (High to Low)</option>
                <option value="amount_asc" className='dark:text-light-text-primary'>Amount (Low to High)</option>
            </select>
        </div>

    )
}