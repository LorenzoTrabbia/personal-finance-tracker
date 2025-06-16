import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";

import "./index.css";

// Pages
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics.tsx";
import Profile from "./pages/Profile.tsx";
import Settings from "./pages/Settings.tsx";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login";

// Components
import RequireAuth from "./components/RequireAuth.tsx";
import { AppProvider } from "./context/AppProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* ROUTE PUBBLICHE */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* ROUTE PROTETTE */}
          <Route path="/" element={<RequireAuth><App /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
