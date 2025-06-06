import type { AddTransactionButtonProps } from "../types/Props"

function AddTransactionButton({ onClick }: AddTransactionButtonProps) {
    return (
        <button
            type="button"
            onClick={() => onClick()}
            className="w-64 bg-light-positive-value  text-white font-semibold px-4 py-2 rounded-md shadow cursor-pointer"
        >
            + Add Transaction
        </button>
    )
}

export default AddTransactionButton