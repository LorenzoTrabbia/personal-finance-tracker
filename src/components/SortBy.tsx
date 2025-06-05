// Icons
import { ArrowDownUp } from 'lucide-react';

// Types
import type { SortByProps } from "../types/Props"

export default function SortBy({ sortBy, setSortBy }: SortByProps) {
    return (
        <div className="relative w-fit mb-2 rounded-md hover:bg-gray-100 transition-colors duration-200 ease-in-out">
            <div className="pointer-events-none absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <ArrowDownUp className="h-4 w-4" />
            </div>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full pl-10 rounded-md border border-transparent text-gray-500 
            focus:outline-none focus:border-transparent"
            >
                <option value="date_desc">Date (Newest)</option>
                <option value="date_asc">Date (Oldest)</option>
                <option value="amount_desc">Amount (High to Low)</option>
                <option value="amount_asc">Amount (Low to High)</option>
            </select>
        </div>

    )
}