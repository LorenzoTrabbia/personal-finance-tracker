import { motion, AnimatePresence } from "framer-motion";

// Types
import type { ConfirmDialogProps } from "../types/Props";

export default function ConfirmDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-light-white dark:bg-dark-background rounded-xl p-6 shadow-lg w-80"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                        {description && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 text-sm rounded-md bg-red-600 text-light-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
