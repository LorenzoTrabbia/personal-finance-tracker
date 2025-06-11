import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

// Components
import { BalanceOverTimeChart, ExpensesByCategoryBarChart, ExpensesByCategoryChart, IncomeExpenseChart } from '../components/AnalyticCharts';
import Spinner from '../components/Spinner';

// Icons
import { ChevronDown } from 'lucide-react';

const AnalyticsPage = () => {
    const { transactions, loadingTransactions } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

    const categories = Array.from(new Set(transactions.map(tx => tx.category)));

    const getFilteredTransactions = () => {
        return transactions.filter((transaction) => {
            const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
            const transactionDate = new Date(transaction.date);
            const now = new Date();

            let matchesPeriod = true;
            if (selectedPeriod === 'lastMonth') {
                const lastMonth = new Date();
                lastMonth.setMonth(now.getMonth() - 1);
                matchesPeriod = transactionDate >= lastMonth;
            } else if (selectedPeriod === 'last3Months') {
                const last3Months = new Date();
                last3Months.setMonth(now.getMonth() - 3);
                matchesPeriod = transactionDate >= last3Months;
            } else if (selectedPeriod === 'last6Months') {
                const last6Months = new Date();
                last6Months.setMonth(now.getMonth() - 6);
                matchesPeriod = transactionDate >= last6Months;
            } else if (selectedPeriod === 'thisYear') {
                matchesPeriod = transactionDate.getFullYear() === now.getFullYear();
            }

            return matchesCategory && matchesPeriod;
        });
    };

    const filteredTransactions = getFilteredTransactions();

    return (
        <div className="flex-1 p-10 pb-8">
            <h1 className="text-4xl font-semibold mb-8 text-light-primary dark:text-dark-text-primary">
                Analytics
            </h1>
            {loadingTransactions ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                        {/* Filters */}
                        <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow">
                            <div className="flex flex-col md:flex-row md:gap-4">
                                {/* Category Filter */}
                                <div className="flex-1 mb-4 md:mb-0">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full appearance-none rounded-lg border p-2 pr-10 bg-white dark:bg-dark-background text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                        >
                                            <option value="all">All</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Period Filter */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
                                    <div className="relative">
                                        <select
                                            value={selectedPeriod}
                                            onChange={(e) => setSelectedPeriod(e.target.value)}
                                            className="w-full appearance-none rounded-lg border p-2 pr-10 bg-white dark:bg-dark-background text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                        >
                                            <option value="all">All Time</option>
                                            <option value="lastMonth">Last Month</option>
                                            <option value="last3Months">Last 3 Months</option>
                                            <option value="last6Months">Last 6 Months</option>
                                            <option value="thisYear">This Year</option>
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Balance Over Time Chart */}
                        <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow">
                            <h2 className="text-light-primary dark:text-dark-text-primary text-lg font-semibold mb-4">Balance Over Time</h2>
                            <BalanceOverTimeChart transactions={filteredTransactions} />
                        </div>

                        {/* Income vs Expense Chart */}
                        <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow">
                            <h2 className="text-light-primary dark:text-dark-text-primary text-lg font-semibold mb-4">Income vs Expense</h2>
                            <IncomeExpenseChart transactions={filteredTransactions} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        {/* Expenses by Category Chart */}
                        <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow">
                            <h2 className="text-light-primary dark:text-dark-text-primary text-lg font-semibold mb-4">Expenses by Category</h2>
                            <ExpensesByCategoryChart transactions={filteredTransactions} />
                        </div>

                        {/* Placeholder for future content */}
                        <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg shadow">
                            <h2 className="text-light-primary dark:text-dark-text-primary text-lg font-semibold mb-4">Expenses by Category</h2>
                            <ExpensesByCategoryBarChart transactions={filteredTransactions} />
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
