import type { Transaction } from "./Transaction";

export type BalanceCardProps = {
    title: string;
    value: number;
    image: string;
    size?: "large" | "small";
  gradient?: "green" | "red";
};

export type FilterBarProps = {
    sortBy: string;
    setSortBy: (val: string) => void;
    selectedCategory: string;
    setSelectedCategory: (val: string) => void;
    selectedMonth: string;
    setSelectedMonth: (val: string) => void;
    selectedYear: string;
    setSelectedYear: (val: string) => void;
    availableCategories: string[];
    availableYears: number[];
};

export type TransactionItemProps = {
    tx: Transaction;
};

export type AddTransactionButtonProps = {
    onClick: () => void;
};
  
  
  