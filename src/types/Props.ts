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
    disabled?: boolean;
};

export type TransactionItemProps = {
    transaction: Transaction;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transaction: Transaction) => void;
};

export type AddTransactionButtonProps = {
    onClick: () => void;
};

export type SortByProps = {
    sortBy: string;
    setSortBy: (val: string) => void;
    disabled?: boolean;
}
  
export type AddTransactionModalProps = {
    onClose: () => void;
    existingTransaction?: Transaction | null;
    onSaveSuccess?: () => void;
};

export type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
}
  
  