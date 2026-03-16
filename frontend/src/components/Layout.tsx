import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface LayoutProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
  children: React.ReactNode;
}

export function Layout({ tabs, activeTab, onTabChange, children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-night">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      <main className="flex-1 bg-sand text-night">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
