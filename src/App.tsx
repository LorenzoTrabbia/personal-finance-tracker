import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-dark-background">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}


export default App;
