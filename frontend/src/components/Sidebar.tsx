import { LucideIcon, LayoutDashboard, Users2, CalendarClock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const icons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  patients: Users2,
  agenda: CalendarClock
};

interface SidebarProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function Sidebar({ tabs, activeTab, onTabChange }: SidebarProps) {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-night text-sand border-r border-night/40 flex flex-col">
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-ocean/80">ChatBot Psico</p>
        <p className="text-2xl font-semibold">Panel Clínico</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = icons[tab.key] ?? LayoutDashboard;
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                isActive ? "bg-ocean text-night" : "hover:bg-night/40"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="m-4 rounded-xl border border-coral px-3 py-2 text-sm text-coral hover:bg-coral hover:text-night"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
