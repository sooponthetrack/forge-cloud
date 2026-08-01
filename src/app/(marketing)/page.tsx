const useCases = [
  { name: "Creator", desc: "A private media vault with share links, previews, and backups — billing stays out of the way." },
  { name: "Founder", desc: "Deploy an app, point a domain at it, watch logs and health, manage env vars." },
  { name: "Team", desc: "A shared workspace with roles, invites, folders, and a full audit history." },
  { name: "Agency", desc: "Isolated client spaces with clean handoff and per-project permissions." },
  { name: "Business", desc: "A locked-down environment with onboarding support and restore help on call." },
];

const trustMarkers = [
  "TLS everywhere",
  "Server-side RBAC",
  "Nightly backups, tested restores",
  "Every admin action audit-logged",
];

const steps = [
  { n: "Choose", desc: "Pick a template — Creator Vault, Founder Stack, Team Workspace, and more." },
  { n: "Pay", desc: "One subscription, handled by Stripe. No separate invoices to chase." },
  { n: "Provision", desc: "Storage, backups, and access are set up automatically in the background." },
  { n: "Work", desc: "Your dashboard opens ready — files, apps, or workspace already in place." },
];

const securityList = [
  "Two-factor authentication",
  "Role-based access, enforced on the server",
  "Signed, expiring share links",
  "Full activity and login history",
  "Backup health and last verified restore",
  "Encryption status, always visible",
];

const plans = [
  { name: "Starter", price: "$19", includes: "Small vault, basic access, backup" },
  { name: "Pro", price: "$49", includes: "More storage, restore help, monitoring" },
  { name: "Team", price: "$99", includes: "Multiple users, roles, shared workspace" },
  { name: "Business", price: "$199+", includes: "Higher limits, onboarding, priority support" },
];

const faqs = [
  { q: "What happens right after I pay?", a: "Your tenant is created from the template you picked, storage and backups are attached, and your dashboard shows \u201cReady\u201d — usually in under a minute." },
  { q: "Who can see my files?", a: "Only the people you invite, at the role you set. Access checks run on the server, not just in the interface." },
  { q: "How are backups verified?", a: "Every backup job has a restore path we test on a schedule, and the result — pass or fail — shows up on your dashboard." },
  { q: "Can I move off ForgeCloud later?", a: "Yes. Vault contents and app artifacts are yours to export at any time." },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="eyebrow mb-5">ForgeCloud</p>
            <h1 className="font-display text-[2.75rem] leading-[1.05] tracking-tight md:text-6xl">
              Private cloud that feels effortless.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/80">
              Storage, app hosting, team workspaces, backups, and security — managed for you.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="/signup"
                className="rounded-card bg-ember px-6 py-3 text-sm font-semibold text-ivory shadow-soft transition hover:brightness-95"
              >
                Get started
              </a>
              <a href="/#templates" className="text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                See templates
              </a>
            </div>
          </div>

          {/* Signature element: a live-feeling ledger, echoing the product's own audit log */}
          <div className="rounded-card bg-charcoal p-6 shadow-soft">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ivory/50">
              Activity — Founder Stack
            </p>
            <ul className="space-y-3 font-mono text-[13px] text-ivory/90">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                tenant.provisioned&nbsp;<span className="text-ivory/50">· 41s</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                backup.verified&nbsp;<span className="text-ivory/50">· nightly</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                domain.ssl_issued&nbsp;<span className="text-ivory/50">· app.yourdomain.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                access.role_granted&nbsp;<span className="text-ivory/50">· member</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="divider border-y border-ink/10 bg-stone/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          {trustMarkers.map((t) => (
            <p key={t} className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/70">
              {t}
            </p>
          ))}
        </div>
      </section>

      {/* Use-case cards */}
      <section id="templates" className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow mb-3">Built for how you work</p>
        <h2 className="font-display text-3xl md:text-4xl">One platform, five ways to use it.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <div key={u.name} className="card p-6">
              <h3 className="font-display text-xl">{u.name}</h3>
              <p className="mt-2 text-sm text-ink/70">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="eyebrow mb-3">How it works</p>
          <h2 className="font-display text-3xl md:text-4xl">From signup to ready, on its own.</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n}>
                <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-display text-lg">{s.n}</p>
                <p className="mt-1 text-sm text-ink/70">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Security proof */}
      <section className="bg-charcoal py-20 text-ivory">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory/50">Security</p>
          <h2 className="font-display text-3xl md:text-4xl">Real in the backend, visible in the dashboard.</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {securityList.map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm text-ivory/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                {s}
              </li>
            ))}
          </ul>
          <a href="/security" className="mt-8 inline-block text-sm font-semibold underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory">
            Read the full security page
          </a>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow mb-3">Pricing</p>
        <h2 className="font-display text-3xl md:text-4xl">Simple plans. No surprise infrastructure bills.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className="card p-6">
              <p className="font-display text-lg">{p.name}</p>
              <p className="mt-2 font-mono text-2xl">{p.price}<span className="text-sm text-muted">/mo</span></p>
              <p className="mt-3 text-sm text-ink/70">{p.includes}</p>
            </div>
          ))}
        </div>
        <a href="/pricing" className="mt-8 inline-block text-sm font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          Compare plans in detail
        </a>
      </section>

      {/* FAQ */}
      <section className="bg-stone/40 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="eyebrow mb-3">FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl">Questions, answered plainly.</h2>
          <dl className="mt-10 space-y-8">
            {faqs.map((f) => (
              <div key={f.q} className="divider pt-6 first:border-0 first:pt-0">
                <dt className="font-display text-lg">{f.q}</dt>
                <dd className="mt-2 text-sm text-ink/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl md:text-5xl">Private cloud that feels effortless.</h2>
        <a
          href="/signup"
          className="mt-8 inline-block rounded-card bg-ember px-7 py-3.5 text-sm font-semibold text-ivory shadow-soft transition hover:brightness-95"
        >
          Get started
        </a>
      </section>
    </main>
  );
}
