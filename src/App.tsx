import { useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from 'react-swipeable';

// Hooks
import { useMediaQuery } from "./hooks/useMediaQuery";

// Components
import Sidebar from "./components/Sidebar";

// Icons
import { Menu, Sparkles } from "lucide-react";
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
        <div className="fixed left-0 top-0 z-50 flex h-14 w-full items-center border-b border-white/10 bg-dark-primary px-4 shadow-lg shadow-slate-950/10">
          <button onClick={toggleSidebar} aria-label="Open navigation menu" className="rounded-xl p-2 text-white transition hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-3 flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-dark-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white">Personal Finance</p>
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Your money, clarified</p>
            </div>
          </div>
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

      <main className={`relative flex-1 overflow-x-hidden overflow-y-auto ${!hideSidebar ? "pt-14 md:pt-0" : ""}`}>
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={[
              "relative min-h-full",
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
