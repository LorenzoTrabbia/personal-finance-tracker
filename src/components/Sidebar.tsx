import SidebarContent from "./SidebarContent";

export default function Sidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen max-h-screen w-72 shrink-0 flex-col justify-between overflow-hidden border-r border-slate-200 bg-dark-primary p-5 py-8 shadow-sm dark:border-slate-800 md:flex">
            <SidebarContent />
        </aside>
    );
}
