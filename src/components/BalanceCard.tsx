import type { BalanceCardProps } from "../types/Props"

function BalanceCard({ title, value, style, currency }: BalanceCardProps) {
    return (
        <div className={[
            "relative overflow-hidden rounded-3xl border p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg",
            "flex min-h-36 w-full flex-col justify-between",
            style === "reverse"
                ? "border-dark-primary bg-dark-primary text-white dark:border-emerald-900/50 dark:bg-dark-card"
                : "border-light-border bg-light-card text-light-text-primary dark:border-dark-border dark:bg-dark-card dark:text-dark-text-primary",
        ].join(" ")}>
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{title}</span>
            <span className="relative text-3xl font-semibold tracking-tight">{currency}{value.toFixed(2)}</span>
        </div>
    );
}

export default BalanceCard