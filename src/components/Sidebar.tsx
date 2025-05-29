import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white shadow-md min-h-screen p-6 hidden md:block">
            <nav className="flex flex-col space-y-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "font-bold text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600"
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive
                            ? "font-bold text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600"
                    }
                >
                    Profile
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive
                            ? "font-bold text-indigo-600"
                            : "text-gray-700 hover:text-indigo-600"
                    }
                >
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
}