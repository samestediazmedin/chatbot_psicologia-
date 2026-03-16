import { useAuth } from "../hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-night/10 bg-white/80 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="text-2xl font-semibold text-night">Dashboard psicológico</h1>
        <p className="text-sm text-night/60">Monitoreo en tiempo real de pacientes y alertas clínicas</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-night">{user?.name ?? "Practicante"}</p>
        <p className="text-xs text-night/60">{user?.role ?? "Estudiante"}</p>
      </div>
    </header>
  );
}
