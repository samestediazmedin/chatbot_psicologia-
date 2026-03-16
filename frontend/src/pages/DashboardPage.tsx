import { useDashboard } from "../hooks/useDashboard";
import { MetricCard } from "../components/MetricCard";
import { NotificationCard } from "../components/NotificationCard";

export function DashboardPage() {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return <p className="text-night/60">Cargando métricas...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pacientes activos" value={data.totalPatients} helper="Últimos 30 días" />
        <MetricCard label="Citas programadas" value={data.totalAppointments} helper="Semana en curso" />
        <MetricCard
          label="Alertas alto riesgo"
          value={data.highRiskAlerts}
          helper="Casos que requieren seguimiento inmediato"
          accent="bg-coral"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Ansiedad promedio" value={`${data.averages.anxiety.toFixed(1)}/10`} />
        <MetricCard label="Depresión promedio" value={`${data.averages.depression.toFixed(1)}/10`} />
        <MetricCard label="Estrés promedio" value={`${data.averages.stress.toFixed(1)}/10`} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <NotificationCard
          title="Paciente en seguimiento"
          description="Último GHQ-12 > 15. Revisar plan de acompañamiento."
          level="alto"
        />
        <NotificationCard
          title="DASS-12 por completar"
          description="4 pacientes quedaron con evaluación pendiente."
          level="medio"
        />
      </section>
    </div>
  );
}
