"use client";

import { useEffect, useState } from "react";

type Split = {
  id: string;
  tenant_id: string;
  platform_share_pct: string;
  recipient_share_pct: string;
  active: boolean;
  effective_from: string;
};

export function SplitsManager() {
  const [splits, setSplits] = useState<Split[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState("");
  const [platformPct, setPlatformPct] = useState(20);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/splits");
    if (res.ok) setSplits((await res.json()).splits);
  }

  useEffect(() => {
    load();
  }, []);

  async function createSplit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/splits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId,
        platformSharePct: platformPct,
        recipientSharePct: 100 - platformPct,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error?.formErrors?.[0] ?? body.error ?? "Couldn't save split.");
      return;
    }

    setTenantId("");
    load();
  }

  return (
    <div>
      <form onSubmit={createSplit} className="card mb-6 grid gap-3 p-6 sm:grid-cols-4 sm:items-end">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink/70">Tenant ID</label>
          <input
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
            placeholder="uuid — see the Tenants tab"
            className="w-full rounded-card border border-ink/15 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/70">Platform share %</label>
          <input
            type="number"
            min={0}
            max={100}
            value={platformPct}
            onChange={(e) => setPlatformPct(Number(e.target.value))}
            className="w-full rounded-card border border-ink/15 bg-white px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-muted">Recipient gets {100 - platformPct}%</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-card bg-ember px-4 py-2 text-sm font-semibold text-ivory shadow-soft transition hover:brightness-95 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Set split"}
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      {!splits ? (
        <p className="text-sm text-ink/60">Loading…</p>
      ) : splits.length === 0 ? (
        <p className="text-sm text-ink/60">No split rules yet.</p>
      ) : (
        <div className="card divide-y divide-ink/10">
          {splits.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium">Tenant {s.tenant_id.slice(0, 8)}…</p>
                <p className="text-xs text-muted">
                  Platform {s.platform_share_pct}% · Recipient {s.recipient_share_pct}%
                </p>
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${s.active ? "text-success" : "text-muted"}`}
              >
                {s.active ? "Active" : "Superseded"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
