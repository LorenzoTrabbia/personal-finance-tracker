import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login"); // o dove vuoi mandare dopo il logout
        } catch (error) {
            console.error("Errore durante il logout:", error);
        }
    };

    return (
        <aside className="w-64 bg-white shadow-md min-h-screen p-6 hidden md:flex flex-col justify-between">
            <nav className="flex flex-col space-y-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-indigo-600" : "text-gray-700 hover:text-indigo-600"
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-indigo-600" : "text-gray-700 hover:text-indigo-600"
                    }
                >
                    Profile
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive ? "font-bold text-indigo-600" : "text-gray-700 hover:text-indigo-600"
                    }
                >
                    Settings
                </NavLink>
            </nav>

            <button
                onClick={handleLogout}
                className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </aside>
    );
}
