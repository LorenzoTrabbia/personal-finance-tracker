// Types
import { months } from "../types/Months";
import type { FilterBarProps } from "../types/Props"

// Icons
import { ChevronDown } from 'lucide-react';

export default function FilterBar({
    selectedCategory,
    setSelectedCategory,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    availableCategories,
    availableYears,
    disabled = false
}: FilterBarProps) {
    const resetFilters = () => {
        setSelectedCategory("");
        setSelectedMonth("");
        setSelectedYear("");
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full flex-wrap">

            {/* Categories filter */}
            <div className="relative w-48">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={disabled}
                    className={`appearance-none w-full px-4 py-2 pr-10 rounded-md border shadow-2xs focus:outline-none transition
                        ${disabled
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 focus:ring-2 focus:ring-dark-secondary-background focus:border-transparent'
                        }`}
                >
                    <option value="" disabled hidden>
                        Category
                    </option>
                    <option value="">All Categories</option>
                    {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <ChevronDown className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-500'}`} />
                </div>
            </div>

            {/* Months filter */}
            <div className="relative w-48">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    disabled={disabled}
                    className={`appearance-none w-full px-4 py-2 pr-10 rounded-md border shadow-2xs focus:outline-none transition
                        ${disabled
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 focus:ring-2 focus:ring-dark-secondary-background focus:border-transparent'
                        }`}
                >
                    <option value="" disabled hidden>
                        Month
                    </option>
                    <option value="">All Months</option>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <ChevronDown className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-500'}`} />
                </div>
            </div>


            {/* Years filter */}
            <div className="relative w-48">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    disabled={disabled}
                    className={`appearance-none w-full px-4 py-2 pr-10 rounded-md border shadow-2xs focus:outline-none transition
                        ${disabled
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 focus:ring-2 focus:ring-dark-secondary-background focus:border-transparent'
                        }`}
                >
                    <option value="" disabled hidden>
                        Year
                    </option>
                    <option value="">All Years</option>
                    {availableYears.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <ChevronDown className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-500'}`} />
                </div>
            </div>

            {/* Reset Filters Button */}
            {(selectedCategory || selectedMonth || selectedYear) && (
                <button
                    onClick={resetFilters}
                    disabled={disabled}
                    className={`mt-2 text-sm transition ${disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-500 cursor-pointer hover:underline hover:opacity-90'
                        }`}
                >
                    Reset Filters
                </button>
            )}
        </div>
    );
}