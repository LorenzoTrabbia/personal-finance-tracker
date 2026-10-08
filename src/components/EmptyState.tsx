import { FileText } from "lucide-react"; // oppure un'altra icona che usi nel progetto
import type { EmptyStateProps } from "../types/Props";

export default function EmptyState({ isSearching = false }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-light-border bg-light-background/60 px-6 py-16 text-center text-light-text-secondary dark:border-dark-border dark:bg-dark-background/50 dark:text-dark-text-secondary">
            <div className="mb-4 rounded-2xl bg-emerald-50 p-3 text-light-positive-value dark:bg-emerald-950/40">
                <FileText className="h-7 w-7" aria-hidden="true" />
            </div>
            {isSearching ? (
                <>
                    <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">No matching transactions</p>
                    <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                </>
            ) : (
                <>
                    <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">No transactions yet</p>
                    <p className="mt-1 text-sm">Add your first transaction to start tracking your finances.</p>
                </>
            )}
        </div>
    );
}