import type { AddTransactionButtonProps } from "../types/Props"
import { Plus } from "lucide-react";

function AddTransactionButton({ onClick }: AddTransactionButtonProps) {
    return (
        <button
            type="button"
            onClick={() => onClick()}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 font-semibold text-dark-primary shadow-sm shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-md sm:w-auto"
        >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add transaction
        </button>
    )
}

export default AddTransactionButton