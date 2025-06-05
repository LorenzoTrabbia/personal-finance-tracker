import { months } from "../types/Months";
import type { FilterBarProps } from "../types/Props"

export default function FilterBar({
    sortBy,
    setSortBy,
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

    const tagBase =
        "cursor-pointer px-4 py-1 rounded-full border transition select-none";

    const tagSelected =
        "bg-blue-600 border-blue-600 text-white hover:bg-blue-700";

    const tagUnselected =
        "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200";

    return (
        <div className="flex flex-col gap-3 mb-6 items-left">
            {/* SortBy dropdown */}
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-1 rounded-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="date_desc">Data (più recente)</option>
                <option value="date_asc">Data (meno recente)</option>
                <option value="amount_desc">Importo (decrescente)</option>
                <option value="amount_asc">Importo (crescente)</option>
            </select>

            {/* Categories tags */}
            <div className="flex flex-wrap gap-2">
                <span
                    className={`${tagBase} ${selectedCategory === "" ? tagSelected : tagUnselected
                        }`}
                    onClick={() => setSelectedCategory("")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedCategory("")}
                >
                    Tutte
                </span>
                {availableCategories.map((cat) => (
                    <span
                        key={cat}
                        className={`${tagBase} ${selectedCategory === cat ? tagSelected : tagUnselected
                            }`}
                        onClick={() => setSelectedCategory(cat)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedCategory(cat)}
                    >
                        {cat}
                    </span>
                ))}
            </div>

            {/* Filtro mese */}
            <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none px-4 py-1 rounded-full border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Tutti i mesi</option>
                {months.map((m) => (
                    <option key={m.value} value={m.value}>
                        {m.label}
                    </option>
                ))}
            </select>

            {/* Years tags */}
            <div className="flex flex-wrap gap-2">
                <span
                    className={`${tagBase} ${selectedYear === "" ? tagSelected : tagUnselected
                        }`}
                    onClick={() => setSelectedYear("")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedYear("")}
                >
                    Tutti
                </span>
                {availableYears.map((y) => (
                    <span
                        key={y}
                        className={`${tagBase} ${selectedYear === String(y) ? tagSelected : tagUnselected
                            }`}
                        onClick={() => setSelectedYear(String(y))}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedYear(String(y))}
                    >
                        {y}
                    </span>
                ))}
            </div>

            {/* Reset */}
            <button
                onClick={resetFilters}
                className="ml-auto px-4 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
                Reset filtri
            </button>
        </div>
    );
}