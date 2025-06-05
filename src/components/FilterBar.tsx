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
                    className="appearance-none w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 
                    shadow-2xs focus:outline-none focus:ring-2 focus:ring-dark-secondary-background focus:border-transparent"
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
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>

            {/* Months filter */}
            <div className="relative w-48">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 
                    shadow-2xs focus:outline-none focus:ring-2 focus:ring-dark-secondary-background focus:border-transparent"
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
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>


            {/* Years filter */}
            <div className="relative w-48">
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none w-full px-4 py-2 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 
                    shadow-2xs focus:outline-none focus:ring-2 focus:ring-dark-secondary-background focus:border-transparent"
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
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>

            {(selectedCategory || selectedMonth || selectedYear) && (
                <button
                    onClick={resetFilters}
                    className="mt-2 text-sm text-red-500 cursor-pointer hover:underline hover:opacity-90 transition"
                >
                    Reset Filters
                </button>
            )}
        </div>
    );
}