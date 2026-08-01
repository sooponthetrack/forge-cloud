"use client";

import { useState } from "react";

const PLANS = [
  { slug: "starter", name: "Starter", price: "$19", includes: "Small vault, basic access, backup" },
  { slug: "pro", name: "Pro", price: "$49", includes: "More storage, restore help, monitoring" },
  { slug: "team", name: "Team", price: "$99", includes: "Multiple users, roles, shared workspace" },
  { slug: "business", name: "Business", price: "$199+", includes: "Higher limits, onboarding, priority support" },
] as const;

export function PlanPicker() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChoose(slug: string) {
    setError(null);
    setLoadingSlug(slug);

    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planSlug: slug }),
    });

    if (!res.ok) {
      setLoadingSlug(null);
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Couldn't start checkout. Try again.");
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => (
          <div key={p.slug} className="card flex flex-col p-6">
            <p className="font-display text-lg">{p.name}</p>
            <p className="mt-2 font-mono text-2xl">
              {p.price}
              <span className="text-sm text-muted">/mo</span>
            </p>
            <p className="mt-3 flex-1 text-sm text-ink/70">{p.includes}</p>
            <button
              onClick={() => handleChoose(p.slug)}
              disabled={loadingSlug !== null}
              className="mt-5 rounded-card bg-ember px-4 py-2.5 text-sm font-semibold text-ivory shadow-soft transition hover:brightness-95 disabled:opacity-60"
            >
              {loadingSlug === p.slug ? "Starting checkout…" : "Choose plan"}
            </button>
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
