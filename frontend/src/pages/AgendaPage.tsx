import { useAppointments } from "../hooks/useAppointments";

export function AgendaPage() {
  const { appointments, loading } = useAppointments();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-night">Agenda clínica</h2>
          <p className="text-sm text-night/60">Coincidencia practicante-sala optimizada</p>
        </div>
        <button className="rounded-xl border border-night/20 px-4 py-2 text-sm text-night">
          Exportar día
        </button>
      </div>

      <div className="rounded-2xl border border-night/10 bg-white/80">
        {loading ? (
          <p className="px-4 py-6 text-night/60">Cargando agenda...</p>
        ) : appointments.length === 0 ? (
          <p className="px-4 py-6 text-night/60">No hay citas programadas para hoy.</p>
        ) : (
          appointments.map((slot) => (
            <div key={slot.id} className="grid grid-cols-4 items-center border-b border-night/5 px-4 py-3 last:border-none">
              <p className="text-sm font-semibold text-night">{slot.timeframe}</p>
              <p className="text-night">{slot.patient?.name ?? "Pendiente"}</p>
              <p className="text-night/70">{slot.practitioner?.name ?? "Sin asignar"}</p>
              <p className="text-right text-sm text-night/60">{slot.consultingRoom?.name ?? "Remoto"}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
