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
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">

            {/* Categories filter */}
            <div className="relative w-full">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={disabled}
                    className={`select-modern h-12 w-full px-4 pr-10 text-sm
                        ${disabled
                            ? 'cursor-not-allowed border-gray-200 text-gray-400'
                            : 'text-light-text-primary dark:text-dark-text-primary'
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
            <div className="relative w-full">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    disabled={disabled}
                    className={`select-modern h-12 w-full px-4 pr-10 text-sm
                        ${disabled
                            ? 'cursor-not-allowed border-gray-200 text-gray-400'
                            : 'text-light-text-primary dark:text-dark-text-primary'
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
            <div className="relative w-full">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    disabled={disabled}
                    className={`select-modern h-12 w-full px-4 pr-10 text-sm
                        ${disabled
                            ? 'cursor-not-allowed border-gray-200 text-gray-400'
                            : 'text-light-text-primary dark:text-dark-text-primary'
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
                    className={`col-span-full justify-self-start text-sm font-medium transition ${disabled
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