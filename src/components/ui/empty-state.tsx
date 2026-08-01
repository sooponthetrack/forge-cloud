import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  helper,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  helper?: string;
}) {
  return (
    <div className="card flex flex-col items-start gap-3 p-8 sm:p-10">
      {icon && <div className="text-ember">{icon}</div>}
      <h3 className="font-display text-xl">{title}</h3>
      <p className="max-w-md text-sm text-ink/70">{description}</p>
      <a
        href={ctaHref}
        className="mt-2 inline-block rounded-card bg-ember px-5 py-2.5 text-sm font-semibold text-ivory shadow-soft transition hover:brightness-95"
      >
        {ctaLabel}
      </a>
      {helper && <p className="text-xs text-muted">{helper}</p>}
    </div>
  );
}
