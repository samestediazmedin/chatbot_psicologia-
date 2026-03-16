interface MetricCardProps {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
}

export function MetricCard({ label, value, helper, accent = "bg-ocean" }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-night/10 bg-white/60 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-night/50">{label}</p>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-night">{value}</span>
        <span className={`h-2 w-2 rounded-full ${accent}`} />
      </div>
      {helper && <p className="mt-2 text-xs text-night/60">{helper}</p>}
    </div>
  );
}
