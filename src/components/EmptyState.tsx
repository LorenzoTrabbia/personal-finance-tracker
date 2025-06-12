import { FileText } from "lucide-react"; // oppure un'altra icona che usi nel progetto
import type { EmptyStateProps } from "../types/Props";

export default function EmptyState({ isSearching = false }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mb-4" />
            {isSearching ? (
                <>
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">Try adjusting your search query.</p>
                </>
            ) : (
                <>
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">Start by adding your first one!</p>
                </>
            )}
        </div>
    );
}