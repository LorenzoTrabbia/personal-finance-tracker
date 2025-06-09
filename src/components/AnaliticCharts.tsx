import { ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid, Area, AreaChart } from 'recharts';
import type { Transaction } from '../types/Transaction';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

// Balance Over Time Chart
export const BalanceOverTimeChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { currency, isDarkMode } = useContext(AppContext);

    const data = transactions.reduce((acc, tx) => {
        const txDate = new Date(tx.date);
        const month = `${txDate.getFullYear()}-${txDate.getMonth() + 1}`;
        const existing = acc.find(item => item.month === month);
        const amount = tx.type === 'income' ? tx.amount : -tx.amount;

        if (existing) {
            existing.balance += amount;
        } else {
            acc.push({ month, balance: amount });
        }

        return acc;
    }, [] as { month: string; balance: number }[]);

    const sortedData = data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    let cumulative = 0;
    const cumulativeData = sortedData.map(item => {
        cumulative += item.balance;
        return { month: item.month, balance: cumulative };
    });

    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cumulativeData}>
                <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                    dataKey="month"
                    tickFormatter={(monthStr) => {
                        const [year, month] = monthStr.split('-');
                        return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', { month: 'short' });
                    }}
                    tick={{ fill: isDarkMode ? '#ccc' : '#333', fontSize: 12 }}
                />
                <YAxis
                    tickFormatter={(value) => `${currency}${value}`}
                    tick={{ fill: isDarkMode ? '#ccc' : '#333', fontSize: 12 }}
                />
                <Tooltip
                    formatter={(value: number) => `${currency}${value}`}
                    contentStyle={{ backgroundColor: '#222', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                />
                <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorBalance)"
                    dot={{ r: 5, stroke: 'none', fill: '#3b82f6' }}
                    activeDot={{ r: 7, stroke: 'none', fill: '#3b82f6' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// Income vs Expense Chart
export const IncomeExpenseChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { currency, isDarkMode } = useContext(AppContext);
    const data = transactions.reduce((acc, tx) => {
        const txDate = new Date(tx.date);
        const month = `${txDate.getFullYear()}-${txDate.getMonth() + 1}`;
        const existing = acc.find(item => item.month === month);

        if (existing) {
            existing[tx.type] += tx.amount;
        } else {
            acc.push({ month, income: tx.type === 'income' ? tx.amount : 0, expense: tx.type === 'expense' ? tx.amount : 0 });
        }

        return acc;
    }, [] as { month: string; income: number; expense: number }[]);

    const sortedData = data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sortedData}>
                <XAxis
                    dataKey="month"
                    tickFormatter={(monthStr) => {
                        const [year, month] = monthStr.split('-');
                        return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', { month: 'short' });
                    }}
                    tick={{ fill: isDarkMode ? '#ccc' : '#333', fontSize: 12 }}
                />
                <YAxis
                    tickFormatter={(value) => `${currency}${value}`}
                    tick={{ fill: isDarkMode ? '#ccc' : '#333', fontSize: 12 }}
                />
                <Tooltip
                    formatter={(value: number) => `${currency}${value}`}
                    contentStyle={{ backgroundColor: '#222', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                    cursor={false}
                />
                <Legend />
                <Bar dataKey="income" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expense" fill="#0F766E" radius={[3, 3, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: { name: string; value: number }[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    const { currency } = useContext(AppContext);

    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#222', padding: 10, borderRadius: 5, color: '#fff', fontSize: 14 }}>
                <p>{label}</p>
                <p>{payload[0].name}: {currency}{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

// Expenses by Category Chart
const COLORS = [
    '#3B82F6',
    '#1E3A8A',
    '#256D57',
    '#4ADE80',
    '#1F2937',
    '#10B981',
    '#0F766E',
    '#60A5FA'
];

export const ExpensesByCategoryChart = ({ transactions }: { transactions: Transaction[] }) => {
    const expenseData = transactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => {
        const existing = acc.find(item => item.category === tx.category);
        if (existing) {
            existing.amount += tx.amount;
        } else {
            acc.push({ category: tx.category, amount: tx.amount });
        }
        return acc;
    }, [] as { category: string; amount: number }[]);

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={expenseData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    stroke="none"
                >
                    {expenseData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ color: '#ccc' }}
                    iconType="circle"
                    iconSize={10}
                />
            </PieChart>
        </ResponsiveContainer>

    );
};

// Expenses by Category Bar Chart
export const ExpensesByCategoryBarChart = ({ transactions }: { transactions: Transaction[] }) => {
    const { currency, isDarkMode } = useContext(AppContext);

    const expenseData = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => {
            const existing = acc.find(item => item.category === tx.category);
            if (existing) {
                existing.amount += tx.amount;
            } else {
                acc.push({ category: tx.category, amount: tx.amount });
            }
            return acc;
        }, [] as { category: string; amount: number }[]);

    const isMobile = window.innerWidth < 640;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={expenseData}
                layout="vertical"
                margin={isMobile ? { top: 0, right: 0, left: 0, bottom: 0 } : { top: 20, right: 30, left: 20, bottom: 20 }}
            >
                <XAxis
                    type="number"
                    tickFormatter={(value) => `${currency}${value}`}
                    tick={{ fill: isDarkMode ? '#ccc' : '#333', fontSize: 12 }}
                />
                <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fill: isDarkMode ? '#ccc' : '#333', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="amount" radius={[0, 5, 5, 0]}>
                    {expenseData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

