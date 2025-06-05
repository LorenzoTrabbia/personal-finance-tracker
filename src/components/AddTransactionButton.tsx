import type { AddTransactionButtonProps } from "../types/Props"

function AddTransactionButton({ onClick }: AddTransactionButtonProps) {
    return (
        <button
            onClick={() => onClick()}
            className="w-64 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold px-4 py-2 rounded-md shadow cursor-pointer"
        >
            + Add Transaction
        </button>
    )
}

export default AddTransactionButton