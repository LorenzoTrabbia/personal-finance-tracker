import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// Icons
import { LayoutDashboard, User, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved) {
            document.documentElement.classList.toggle("dark", saved === "dark");
            setIsDarkMode(saved === "dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", prefersDark);
            setIsDarkMode(prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;

        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Errore durante il logout:", error);
        }
    };

    return (
        <aside className="w-64 shadow-md min-h-screen p-4 py-8 hidden md:flex flex-col justify-between
            bg-light-primary dark:bg-dark-primary  dark:border-r-2 dark:border-dark-border"
        >
            <nav className="flex flex-col space-y-4 mt-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        [
                            "rounded-lg py-2",
                            "transition-colors duration-200",
                            isActive
                                ? "font-bold text-light-white bg-slate-600"
                                : "text-light-white hover:opacity-100 opacity-80"
                        ].join(" ")
                    }
                >
                    <LayoutDashboard className="inline mx-4 mr-6" />
                    Dashboard
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        [
                            "rounded-lg py-2",
                            "transition-colors duration-200",
                            isActive
                                ? "font-bold text-light-white bg-slate-600"
                                : "text-light-white hover:opacity-100 opacity-80"
                        ].join(" ")
                    }
                >
                    <User className="inline mx-4 mr-6" />
                    Profile
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        [
                            "rounded-lg py-2",
                            "transition-colors duration-200",
                            isActive
                                ? "font-bold text-light-white bg-slate-600"
                                : "text-light-white hover:opacity-100 opacity-80"
                        ].join(" ")
                    }
                >
                    <Settings className="inline mx-4 mr-6" />
                    Settings
                </NavLink>
                <NavLink
                    to="/logout"
                    onClick={handleLogout}
                    className="rounded-lg py-2 mt-6 transition-colors duration-200 text-light-white hover:opacity-100 opacity-80"
                >
                    <LogOut className="inline mx-4 mr-6" color="red" />
                    Logout
                </NavLink>
            </nav>

            <div className="flex flex-col gap-2">
                <label className="switch">
                    <input
                        id="checkbox"
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                    />
                    <span className="slider">
                        <div className="star star_1"></div>
                        <div className="star star_2"></div>
                        <div className="star star_3"></div>
                        <svg viewBox="0 0 16 16" className="cloud_1 cloud">
                            <path
                                transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                                fill="#fff"
                                d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                            ></path>
                        </svg>
                    </span>
                </label>
            </div>

        </aside>
    );
}
