import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAppContext } from "../context/useAppContext";
import { useMediaQuery } from "../hooks/useMediaQuery";

// Types
import type { SidebarContentProps } from "../types/Props";

// Icons
import { LayoutDashboard, ChartNoAxesColumn, User, Settings, LogOut, Sparkles, Moon, Sun } from "lucide-react";

const SidebarContent = ({ closeSidebar }: SidebarContentProps) => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme, avatar, userName } = useAppContext();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Errore durante il logout:", error);
        }
    };

    return (
        <nav className="mt-0 flex h-full flex-col">
            {/* User profile */}
            <div className="mb-12 flex items-center gap-3 px-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-dark-primary shadow-lg shadow-emerald-950/20"><Sparkles className="h-5 w-5" /></div>
                <div>
                    <p className="select-none text-sm font-semibold tracking-tight text-white">Personal Finance</p>
                    <p className="select-none text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Your money, clarified</p>
                </div>
            </div>
            <div className="mb-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                {avatar && (
                    <div
                        className="group relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                        onClick={() => { navigate("/profile"); if (isMobile && closeSidebar) closeSidebar(); }}
                    >
                        <img src={`/avatars/${avatar}`} alt="User Avatar" className="w-full h-full" />
                    </div>
                )}
                <div>
                    <p className="truncate text-sm font-semibold text-white">{userName || "Your account"}</p>
                    <p className="text-xs text-slate-400">Personal workspace</p>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-grow flex-col space-y-2 px-1">
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
                {[
                    { to: "/", label: "Dashboard", icon: LayoutDashboard },
                    { to: "/analytics", label: "Analytics", icon: ChartNoAxesColumn },
                    { to: "/profile", label: "Profile", icon: User },
                    { to: "/settings", label: "Settings", icon: Settings },
                ].map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={
                            () => {
                                if (isMobile && closeSidebar) closeSidebar();
                            }}
                        className={({ isActive }) =>
                            [
                                "flex items-center rounded-2xl px-4 py-3 text-sm transition-colors duration-200",
                                isActive
                                    ? "font-semibold text-white bg-emerald-400/15 shadow-inner shadow-emerald-400/5"
                                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                            ].join(" ")
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    className={`mr-3 h-4 w-4 ${isActive ? "text-emerald-300" : "text-slate-400"}`}
                                />
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Logout & Dark Mode Toggle */}
            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 px-1 pt-5">
                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center rounded-2xl px-3 py-3 text-sm text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                >
                    <LogOut className="mr-3 h-4 w-4 text-red-300" />
                    Logout
                </button>

                {/* Dark Mode Toggle */}
                <button
                    type="button"
                    role="switch"
                    aria-checked={isDarkMode}
                    aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                    onClick={toggleTheme}
                    className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-300 transition hover:border-emerald-400/30 hover:bg-white/10 hover:text-white"
                >
                    <span className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="h-4 w-4 text-emerald-300" /> : <Sun className="h-4 w-4 text-emerald-300" />}
                        <span>{isDarkMode ? "Dark mode" : "Light mode"}</span>
                    </span>
                    <span className={`relative h-6 w-11 rounded-full p-1 transition-colors ${isDarkMode ? "bg-emerald-400" : "bg-slate-600"}`}>
                        <span className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isDarkMode ? "translate-x-5" : "translate-x-0"}`} />
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default SidebarContent;
