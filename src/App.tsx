import { useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from 'react-swipeable';

// Hooks
import { useMediaQuery } from "./hooks/useMediaQuery";

// Components
import Sidebar from "./components/Sidebar";

// Icons
import { Menu } from "lucide-react";
import SidebarContent from "./components/SidebarContent";

function App() {
  const location = useLocation();
  const outlet = useOutlet();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      const target = eventData.event.target as Element;
      if (target.closest('.prevent-sidebar-swipe')) return;
      if (!isSidebarOpen) toggleSidebar();
    },
    onSwipedLeft: (eventData) => {
      const target = eventData.event.target as Element;
      if (target.closest('.prevent-sidebar-swipe')) return;
      if (isSidebarOpen) toggleSidebar();
    },
    delta: 50,
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="flex min-h-screen bg-light-background dark:bg-dark-background transition duration-300">
      {!hideSidebar && !isMobile && <Sidebar />}

      {!hideSidebar && isMobile && (
        <div className="fixed top-0 left-0 w-full h-14 bg-light-primary dark:bg-dark-primary shadow-md flex items-center px-4 z-50">
          <button onClick={toggleSidebar}>
            <Menu className="text-white w-6 h-6" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {!hideSidebar && isMobile && isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 w-64 h-full bg-light-primary dark:bg-dark-primary shadow-lg z-50 p-4 py-8 flex flex-col justify-between"
            >
              <SidebarContent closeSidebar={toggleSidebar} />
              <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden relative pt-14 md:pt-0">
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={[
              "absolute inset-0",
              isMobile ? "pt-14" : "",
            ].join(" ")}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
