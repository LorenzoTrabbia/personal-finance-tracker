import SidebarContent from "./SidebarContent";

export default function Sidebar() {
    return (
        <aside className="w-64 shadow-md min-h-screen p-4 py-8 hidden md:flex flex-col justify-between
      bg-light-primary dark:bg-dark-primary">
            <SidebarContent />
        </aside>
    );
}
