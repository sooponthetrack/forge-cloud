const plans = [
  { name: "Starter", price: "$19", includes: ["Small vault", "Basic access", "Backup"] },
  { name: "Pro", price: "$49", includes: ["More storage", "Restore help", "Monitoring"] },
  { name: "Team", price: "$99", includes: ["Multiple users", "Roles", "Shared workspace"] },
  { name: "Business", price: "$199+", includes: ["Higher limits", "Onboarding", "Priority support"] },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <p className="eyebrow mb-3">Pricing</p>
      <h1 className="font-display text-4xl md:text-5xl">Simple plans. No surprise infrastructure bills.</h1>
      <p className="mt-4 max-w-xl text-ink/70">
        Every plan includes automated provisioning, backups, and server-side access control.
        Migration, domain setup, and premium support are available as paid add-ons.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p.name} className="card flex flex-col p-6">
            <p className="font-display text-lg">{p.name}</p>
            <p className="mt-2 font-mono text-3xl">
              {p.price}
              <span className="text-sm text-muted">/mo</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/70">
              {p.includes.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember" />
                  {i}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="mt-6 rounded-card bg-ember px-4 py-2.5 text-center text-sm font-semibold text-ivory shadow-soft transition hover:brightness-95"
            >
              Get started
            </a>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink/60">
        Signing up creates your account and workspace shell — choose your plan from the
        Billing page once you're in, and provisioning kicks off automatically.
      </p>
    </main>
  );
}
