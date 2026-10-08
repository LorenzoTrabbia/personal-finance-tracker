import type { Transaction } from "./Transaction";

export type BalanceCardProps = {
    title: string;
    value: number;
    style?: string;
    currency?: string;
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
    currency?: string;
};

export type AddTransactionButtonProps = {
    onClick: () => void;
};

export type SortByProps = {
    sortBy: SortOption;
    setSortBy: (val: SortOption) => void;
    disabled?: boolean;
}

export type SortOption = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
  
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
    confirmDisabled?: boolean;
}

export type EmptyStateProps = {
    isSearching?: boolean;
}; 

export type SidebarContentProps = {
    closeSidebar?: () => void;
}