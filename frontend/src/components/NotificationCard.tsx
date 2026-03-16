interface NotificationCardProps {
  title: string;
  description: string;
  level: "bajo" | "medio" | "alto";
}

const palette = {
  bajo: "text-ocean",
  medio: "text-amber-500",
  alto: "text-coral"
};

export function NotificationCard({ title, description, level }: NotificationCardProps) {
  return (
    <article className="rounded-2xl border border-night/10 bg-white/70 p-4">
      <p className={`text-xs uppercase tracking-[0.4em] ${palette[level]}`}>{level}</p>
      <h3 className="mt-2 text-lg font-semibold text-night">{title}</h3>
      <p className="text-sm text-night/60">{description}</p>
    </article>
  );
}
