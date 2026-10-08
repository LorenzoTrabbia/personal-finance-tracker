import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, TrendingUp, ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useAppContext } from "../context/useAppContext";
import { BalanceOverTimeChart, ExpensesByCategoryBarChart, ExpensesByCategoryChart, IncomeExpenseChart } from "../components/AnalyticCharts";
import Spinner from "../components/Spinner";

export default function Analytics() {
    const { transactions, loadingTransactions } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPeriod, setSelectedPeriod] = useState("all");
    const categories = useMemo(() => Array.from(new Set(transactions.map((transaction) => transaction.category))), [transactions]);
    const filteredTransactions = useMemo(() => transactions.filter((transaction) => {
        const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
        const date = new Date(transaction.date);
        const now = new Date();
        const start = selectedPeriod === "lastMonth" ? new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            : selectedPeriod === "last3Months" ? new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                : selectedPeriod === "last6Months" ? new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
                    : null;
        const matchesPeriod = selectedPeriod === "thisYear" ? date.getFullYear() === now.getFullYear() : !start || date >= start;
        return matchesCategory && matchesPeriod;
    }), [transactions, selectedCategory, selectedPeriod]);
    const income = filteredTransactions.filter((transaction) => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = filteredTransactions.filter((transaction) => transaction.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);
    const net = income - expenses;

    return (
        <div className="mx-auto max-w-7xl px-5 py-8 text-light-text-primary dark:text-dark-text-primary sm:px-8 lg:px-10 lg:py-10">
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-dark-primary px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8">
                <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />
                <div className="relative flex items-end justify-between gap-4">
                    <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Insights</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Analytics</h1><p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">See the signals behind your spending and make more informed decisions.</p></div>
                    <TrendingUp className="hidden h-10 w-10 text-emerald-300 sm:block" />
                </div>
            </div>
            {loadingTransactions ? <Spinner /> : (
                <>
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <MetricCard label="Net position" value={net} icon={Wallet} tone="navy" />
                        <MetricCard label="Money in" value={income} icon={ArrowDownRight} tone="green" />
                        <MetricCard label="Money out" value={expenses} icon={ArrowUpRight} tone="red" />
                    </div>
                    <div className="mb-6 rounded-3xl border border-light-border bg-light-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                ["Category", selectedCategory, setSelectedCategory, [["all", "All categories"], ...categories.map((category) => [category, category])]],
                                ["Period", selectedPeriod, setSelectedPeriod, [["all", "All time"], ["lastMonth", "Last month"], ["last3Months", "Last 3 months"], ["last6Months", "Last 6 months"], ["thisYear", "This year"]]],
                            ].map(([label, value, setter, options]) => (
                                <label key={label as string} className="relative block text-sm font-medium">{label as string}<select value={value as string} onChange={(event) => (setter as (value: string) => void)(event.target.value)} className="select-modern mt-2 h-12 w-full px-4 pr-10 text-sm">{(options as string[][]).map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select><ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-slate-400" /></label>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <ChartPanel title="Balance over time" description="Your cumulative balance across the selected period."><BalanceOverTimeChart transactions={filteredTransactions} /></ChartPanel>
                        <ChartPanel title="Income vs expenses" description="Compare money in and money out by month."><IncomeExpenseChart transactions={filteredTransactions} /></ChartPanel>
                        <ChartPanel title="Expenses by category" description="See which categories account for your spending."><ExpensesByCategoryChart transactions={filteredTransactions} /></ChartPanel>
                        <ChartPanel title="Category breakdown" description="A second view of spending distribution."><ExpensesByCategoryBarChart transactions={filteredTransactions} /></ChartPanel>
                    </div>
                </>
            )}
        </div>
    );
}

function ChartPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
    return <section className="rounded-3xl border border-light-border bg-light-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card sm:p-6"><h2 className="text-lg font-semibold">{title}</h2><p className="mb-4 mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">{description}</p>{children}</section>;
}

function MetricCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Wallet; tone: "navy" | "green" | "red" }) {
    const toneClasses = {
        navy: "bg-dark-primary text-white",
        green: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
        red: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
    };
    return <div className={`rounded-3xl border border-transparent p-5 shadow-sm ${toneClasses[tone]}`}><div className="mb-5 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</span><Icon className="h-5 w-5 opacity-80" /></div><p className="text-2xl font-semibold tracking-tight">{value.toFixed(2)}</p></div>;
}
