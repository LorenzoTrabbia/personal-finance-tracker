export default function Spinner() {
    return (
        <div className="space-y-3 py-8" role="status" aria-label="Loading transactions">
            {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />
            ))}
            <span className="sr-only">Loading transactions</span>
        </div>
    );
}
