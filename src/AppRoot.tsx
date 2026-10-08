import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import { AppProvider } from "./context/AppProvider";

export default function AppRoot() {
    return (
        <BrowserRouter>
            <AppProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<RequireAuth><App /></RequireAuth>}>
                        <Route index element={<Dashboard />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </AppProvider>
        </BrowserRouter>
    );
}
