import { FileText } from "lucide-react"; // oppure un'altra icona che usi nel progetto

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm">Start by adding your first one!</p>
        </div>
    );
}
