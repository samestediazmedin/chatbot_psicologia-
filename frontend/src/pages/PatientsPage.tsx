import { usePatients } from "../hooks/usePatients";

function riskBadge(risk?: string) {
  switch (risk) {
    case "alto":
      return "bg-coral/20 text-coral";
    case "medio":
      return "bg-amber-100 text-amber-600";
    default:
      return "bg-ocean/20 text-ocean";
  }
}

export function PatientsPage() {
  const { patients, loading } = usePatients();

  return (
    <section className="rounded-2xl border border-night/10 bg-white/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-night">Pacientes</h2>
          <p className="text-sm text-night/60">Registro de aspirantes y seguimiento clínico</p>
        </div>
        <button className="rounded-xl bg-night px-4 py-2 text-sm text-sand">Nuevo aspirante</button>
      </div>

      {loading ? (
        <p className="mt-6 text-night/60">Cargando pacientes...</p>
      ) : (
        <div className="mt-6 divide-y divide-night/5">
          {patients.map((patient) => {
            const risk = patient.lastMetric?.risk ?? "bajo";
            return (
              <div key={patient.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-night">{patient.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-night/50">{patient.state}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskBadge(risk)}`}>
                  {risk}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
