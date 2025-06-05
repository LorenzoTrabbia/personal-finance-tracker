import type { BalanceCardProps } from "../types/Props"

function BalanceCard({ title, value, style }: BalanceCardProps) {
    return (
        <div
            className={[
                "relative p-4 rounded-xl shadow-md overflow-hidden flex flex-col justify-between w-full max-w-3xl",
                "transition-transform hover:scale-105 duration-200",
                style === "reverse"
                    ? "text-dark-text-primary dark:text-light-text-primary bg-dark-secondary-background dark:bg-light-secondary-background"
                    : "text-light-text-primary dark:text-dark-text-primary bg-light-secondary-background dark:bg-dark-secondary-background",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className="text-base font-light mb-3">{title}</span>
            <span className="text-2xl">€{value.toFixed(2)}</span>
        </div>
    );
}

export default BalanceCard