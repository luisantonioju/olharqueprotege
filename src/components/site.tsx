import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Logo({ size = 48 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M24 46 C24 46 6 30 6 18 A18 18 0 0 1 42 18 C42 30 24 46 24 46 Z"
          className="fill-brand-orange stroke-brand-ink"
          strokeWidth="2.5"
        />
        <circle cx="16" cy="18" r="6" className="fill-brand-white stroke-brand-ink" strokeWidth="2.5" />
        <circle cx="32" cy="18" r="6" className="fill-brand-white stroke-brand-ink" strokeWidth="2.5" />
        <circle cx="16" cy="18" r="2.5" className="fill-brand-ink" />
        <circle cx="32" cy="18" r="2.5" className="fill-brand-ink" />
      </svg>
      <span
        className="font-extrabold leading-[0.9] text-brand-ink"
        style={{ fontSize: size * 0.3 }}
      >
        OLHAR
        <br />
        QUE
        <br />
        PROTEGE
      </span>
    </span>
  );
}

const nav = [
  { to: "/home", label: "Home" },
  { to: "/sobre", label: "Sobre" },
  { to: "/videos", label: "Vídeos" },
  { to: "/blog", label: "Blog" },
  { to: "/extras/cadastro", label: "Cadastrar-me" },
  { to: "/extras/entrar", label: "Entrar" },
  { to: "/extras/cadastro", label: "Extras" },
  { to: "/admin/login", label: "Equipe" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg font-brand text-brand-ink">
      <header className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-brand-cream px-8 py-6 shadow-lg md:flex-row">
          <Link to="/home">
            <Logo />
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {nav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className="font-bold text-brand-ink transition-opacity hover:opacity-70"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">{children}</main>
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-bg to-brand-cream px-4 py-8 font-brand text-brand-ink">
      <div className="w-full max-w-md rounded-3xl bg-brand-white p-10 shadow-2xl">{children}</div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <input
        required
        type={type}
        placeholder={placeholder}
        minLength={type === "password" ? 8 : undefined}
        className="w-full rounded-lg border border-brand-card bg-brand-white px-4 py-3 text-sm outline-none focus:border-brand-accent"
      />
    </label>
  );
}
