import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAppContext } from "../context/useAppContext";
import { useMediaQuery } from "../hooks/useMediaQuery";

// Types
import type { SidebarContentProps } from "../types/Props";

// Icons
import { LayoutDashboard, ChartNoAxesColumn, User, Settings, LogOut } from "lucide-react";

const SidebarContent = ({ closeSidebar }: SidebarContentProps) => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme, avatar } = useAppContext();
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
        <nav className="flex flex-col h-full mt-4">
            {/* User profile */}
            <div className="flex items-center mb-8 gap-4 px-4">
                {avatar && (
                    <div
                        className="relative group w-14 h-14 rounded-full overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:scale-110"
                        onClick={() => { navigate("/profile"); if (isMobile && closeSidebar) closeSidebar(); }}
                    >
                        <img src={`/avatars/${avatar}`} alt="User Avatar" className="w-full h-full" />
                    </div>
                )}
                <div>
                    <h1 className="text-white font-extrabold text-md tracking-widest select-none leading-tight">
                        PERSONAL FINANCE
                    </h1>
                    <p className="text-indigo-200 text-xs font-semibold tracking-wider select-none">
                        TRACKER
                    </p>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-4 flex-grow px-4">
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
                                "rounded-lg py-2 transition-colors duration-200",
                                isActive
                                    ? "font-bold text-light-white bg-slate-600"
                                    : "text-light-white hover:opacity-100 opacity-80",
                            ].join(" ")
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    className={`inline mx-4 mr-6 ${isActive ? "text-blue-400" : "text-gray-400"}`}
                                />
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Logout & Dark Mode Toggle */}
            <div className="flex flex-col gap-4 mt-4 px-4">
                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center rounded-lg py-2 transition-colors duration-200 text-light-white hover:opacity-100 opacity-80"
                >
                    <LogOut className="inline mx-4 mr-6" color="red" />
                    Logout
                </button>

                {/* Dark Mode Toggle */}
                <svg className="hidden">
                    <symbol id="light" viewBox="0 0 24 24">
                        <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(0,12,12)" />
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(45,12,12)" />
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(90,12,12)" />
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(135,12,12)" />
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(180,12,12)" />
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(225,12,12)" />
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(270,12,12)" />
                            <line x1="12" y1="17" x2="12" y2="20" transform="rotate(315,12,12)" />
                        </g>
                        <circle fill="currentColor" cx="12" cy="12" r="5" />
                    </symbol>
                    <symbol id="dark" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M15.1,14.9c-3-0.5-5.5-3-6-6C8.8,7.1,9.1,5.4,9.9,4c0.4-0.8-0.4-1.7-1.2-1.4C4.6,4,1.8,7.9,2,12.5c0.2,5.1,4.4,9.3,9.5,9.5c4.5,0.2,8.5-2.6,9.9-6.6c0.3-0.8-0.6-1.7-1.4-1.2C18.6,14.9,16.9,15.2,15.1,14.9z" />
                    </symbol>
                </svg>
                <label className="switch mx-4 font-semibold">
                    <input className="switch__input" type="checkbox" role="switch" name="dark" checked={isDarkMode} onChange={toggleTheme} />
                    <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                        <use href="#light" />
                    </svg>
                    <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                        <use href="#dark" />
                    </svg>
                    <span className="switch__inner"></span>
                    <span className="switch__inner-icons">
                        <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                            <use href="#light" />
                        </svg>
                        <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                            <use href="#dark" />
                        </svg>
                    </span>
                    <span className="switch__sr">Dark Mode</span>
                </label>
            </div>
        </nav>
    );
};

export default SidebarContent;
