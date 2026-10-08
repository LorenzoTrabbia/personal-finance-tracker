import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
import type { ConfirmDialogProps } from "../types/Props";

export default function ConfirmDialog({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmDisabled = false,
}: ConfirmDialogProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        cancelRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onCancel]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-dialog-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-sm rounded-3xl border border-light-border bg-light-card p-6 shadow-2xl dark:border-dark-border dark:bg-dark-card"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                        {description && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                        )}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                ref={cancelRef}
                                onClick={onCancel}
                                className="h-11 rounded-xl border border-light-border bg-light-card px-4 text-sm font-medium text-gray-700 transition hover:bg-light-background dark:border-dark-border dark:bg-dark-card dark:text-gray-200 dark:hover:bg-dark-background"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={confirmDisabled}
                                className="h-11 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                {confirmDisabled ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
