import { useLocation, useOutlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const location = useLocation();
  const outlet = useOutlet();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex min-h-screen bg-light-background dark:bg-dark-background">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
