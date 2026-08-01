"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message =
        typeof body.error === "string"
          ? body.error
          : body.error?.fieldErrors?.password?.[0] ?? "Something went wrong. Try again.";
      setError(message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <p className="eyebrow mb-3">Get started</p>
      <h1 className="font-display text-3xl">Create your account.</h1>
      <p className="mt-2 text-sm text-ink/70">Under two minutes to your first workspace.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink/80">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-card border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-ember"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-card border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-ember"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink/80">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-card border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-ember"
          />
          <p className="mt-1.5 text-xs text-muted">At least 10 characters.</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-card bg-ember px-6 py-2.5 text-sm font-semibold text-ivory shadow-soft transition hover:brightness-95 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/70">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          Log in
        </a>
      </p>
    </div>
  );
}
