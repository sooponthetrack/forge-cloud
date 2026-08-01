const TONE_DOT: Record<"success" | "warning" | "danger" | "muted", string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  muted: "bg-ink/20",
};

export function StatusCard({
  label,
  value,
  detail,
  tone = "muted",
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "success" | "warning" | "danger" | "muted";
}) {
  return (
    <div className="card p-5">
      <p className="eyebrow">{label}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />
        <p className="font-display text-lg">{value}</p>
      </div>
      {detail && <p className="mt-1 text-xs text-muted">{detail}</p>}
    </div>
  );
}
