import type { BalanceCardProps } from "../types/Props"

const gradientClasses = {
    green: "bg-gradient-to-br from-green-400 to-green-600",
    red: "bg-gradient-to-br from-red-400 to-red-600",
};

function BalanceCard({ title, value, image, size = 'large', gradient }: BalanceCardProps) {
    const baseStyles = "relative p-6 rounded-2xl shadow-md text-white overflow-hidden flex flex-col justify-between";

    // Responsive width:
    // large: full width always
    // small: w-full on xs, w-40 on sm+
    const heightClass = size === "large" ? "h-32" : "h-28";
    const widthClass =
        size === "large"
            ? "w-full max-w-2xl" // evita che si allarghi troppo
            : "w-full sm:w-48";

    const bgColor = gradient ? gradientClasses[gradient] : "bg-light-secondary-background";

    return (
        <div
            className={`${baseStyles} ${bgColor} ${heightClass} ${widthClass}`}
        >
            <span className="text-base font-medium">{title}</span>
            <span className="text-xl font-bold">€{value.toFixed(2)}</span>
            <img
                src={image}
                alt={title}
                className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none select-none"
            />
        </div>
    );
}

export default BalanceCard