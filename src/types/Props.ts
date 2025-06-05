import type { Transaction } from "./Transaction";

export type BalanceCardProps = {
    title: string;
    value: number;
    style?: string;
};

export type FilterBarProps = {
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
    transaction: Transaction;
};

export type AddTransactionButtonProps = {
    onClick: () => void;
};

export type SortByProps = {
    sortBy: string;
    setSortBy: (val: string) => void;
}
  
  
  