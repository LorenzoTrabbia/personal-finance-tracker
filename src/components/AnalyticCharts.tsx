import { useContext } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { AppContext } from "../context/AppContext";
import type { Transaction } from "../types/Transaction";

type ChartColors = {
    accent: string;
    income: string;
    expense: string;
    muted: string;
    grid: string;
    card: string;
};

const palette = ["#34d399", "#60a5fa", "#fbbf24", "#fb7185", "#a78bfa", "#22d3ee", "#f97316", "#94a3b8"];

function getChartColors(isDarkMode: boolean): ChartColors {
    return {
        accent: "#34d399",
        income: "#34d399",
        expense: "#fb7185",
        muted: isDarkMode ? "#94a3b8" : "#64748b",
        grid: isDarkMode ? "#334155" : "#e2e8f0",
        card: isDarkMode ? "#152235" : "#ffffff",
    };
}

function formatMonth(month: string) {
    const [year, value] = month.split("-");
    return new Date(Number(year), Number(value) - 1).toLocaleString("en-US", { month: "short" });
}

function emptyChart(message: string) {
    return <div className="h-[270px] w-full"><EmptyState message={message} /></div>;
}

export const EmptyState = ({ message }: { message: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-light-background/60 px-4 text-slate-400 dark:bg-dark-background/50 dark:text-slate-500"
    >
        <div className="mb-3 rounded-2xl bg-slate-200/70 p-3 dark:bg-slate-800/70"><CircleAlert size={22} /></div>
        <p className="max-w-xs text-center text-xs leading-5">{message}</p>
    </motion.div>
);

export const BalanceOverTimeChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { currency, isDarkMode } = useContext(AppContext);
    const colors = getChartColors(isDarkMode);
    const monthly = transactions.reduce((acc, tx) => {
        const date = new Date(tx.date);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const existing = acc.find((item) => item.month === month);
        const amount = tx.type === "income" ? tx.amount : -tx.amount;
        if (existing) existing.balance += amount;
        else acc.push({ month, balance: amount });
        return acc;
    }, [] as { month: string; balance: number }[]).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    let cumulative = 0;
    const data = monthly.map((item) => ({ month: item.month, balance: (cumulative += item.balance) }));

    if (!data.length) return emptyChart("No transactions recorded for the filters applied.");
    return (
        <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs><linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={colors.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={colors.accent} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="4 8" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `${currency}${value}`} tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={54} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="balance" name="Balance" stroke={colors.accent} strokeWidth={3} fill="url(#balanceGradient)" dot={{ r: 4, stroke: colors.card, strokeWidth: 2, fill: colors.accent }} activeDot={{ r: 6, stroke: colors.card, strokeWidth: 2, fill: colors.accent }} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export const IncomeExpenseChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { currency, isDarkMode } = useContext(AppContext);
    const colors = getChartColors(isDarkMode);
    const data = transactions.reduce((acc, tx) => {
        const date = new Date(tx.date);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const existing = acc.find((item) => item.month === month);
        if (existing) existing[tx.type === "income" ? "income" : "expense"] += tx.amount;
        else acc.push({ month, income: tx.type === "income" ? tx.amount : 0, expense: tx.type === "expense" ? tx.amount : 0 });
        return acc;
    }, [] as { month: string; income: number; expense: number }[]).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    if (!data.length) return emptyChart("No transactions recorded for the filters applied.");
    return (
        <ResponsiveContainer width="100%" height={270}>
            <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="4 8" stroke={colors.grid} vertical={false} />
                <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(value) => `${currency}${value}`} tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={54} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: colors.grid, opacity: 0.35 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ color: colors.muted, fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="income" name="Income" fill={colors.income} radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" name="Expenses" fill={colors.expense} radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
        </ResponsiveContainer>
    );
};

type TooltipProps = { active?: boolean; payload?: Array<{ name?: string; value?: number }>; label?: string };

function ChartTooltip({ active, payload, label }: TooltipProps) {
    const { currency, isDarkMode } = useContext(AppContext);
    if (!active || !payload?.length) return null;
    return (
        <div className={`rounded-2xl border px-3 py-2.5 text-xs shadow-xl ${isDarkMode ? "border-slate-700 bg-dark-card text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}>
            {label && <p className="mb-1 font-semibold">{label}</p>}
            {payload.map((entry, index) => <p key={`${entry.name}-${index}`} className="text-slate-500 dark:text-slate-400">{entry.name}: <span className="font-semibold text-slate-900 dark:text-white">{currency}{Number(entry.value ?? 0).toFixed(2)}</span></p>)}
        </div>
    );
}

function groupExpenses(transactions: Transaction[]) {
    return transactions.filter((tx) => tx.type === "expense").reduce((acc, tx) => {
        const existing = acc.find((item) => item.category === tx.category);
        if (existing) existing.amount += tx.amount;
        else acc.push({ category: tx.category, amount: tx.amount });
        return acc;
    }, [] as { category: string; amount: number }[]);
}

export const ExpensesByCategoryChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { isDarkMode } = useContext(AppContext);
    const colors = getChartColors(isDarkMode);
    const data = groupExpenses(transactions);
    if (!data.length) return emptyChart("No expenses recorded for the filters applied.");
    return (
        <ResponsiveContainer width="100%" height={270}>
            <PieChart>
                <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="46%" innerRadius={58} outerRadius={90} paddingAngle={3} stroke={colors.card} strokeWidth={3}>
                    {data.map((_, index) => <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ color: colors.muted, fontSize: 12 }} iconType="circle" iconSize={8} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const ExpensesByCategoryBarChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { currency, isDarkMode } = useContext(AppContext);
    const colors = getChartColors(isDarkMode);
    const data = groupExpenses(transactions);
    if (!data.length) return emptyChart("No expenses recorded for the filters applied.");
    const isMobile = window.innerWidth < 640;
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={isMobile ? { top: 4, right: 8, left: 0, bottom: 4 } : { top: 8, right: 20, left: 12, bottom: 8 }}>
                <CartesianGrid strokeDasharray="4 8" stroke={colors.grid} horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `${currency}${value}`} tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fill: colors.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={isMobile ? 62 : 78} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: colors.grid, opacity: 0.35 }} />
                <Bar dataKey="amount" name="Expenses" radius={[0, 8, 8, 0]} maxBarSize={24}>
                    {data.map((_, index) => <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
