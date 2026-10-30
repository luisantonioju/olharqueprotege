import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { SiteSearch } from "./site-search";

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
      <header className="border-b border-brand-accent/20 bg-brand-cream">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(44px,1fr)_auto_minmax(44px,1fr)] items-center gap-3 px-4 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0 justify-self-start"><SiteSearch /></div>
          <Link to="/home" aria-label="Olhar Que Protege — início" className="justify-self-center"><Logo size={56} /></Link>
          <Sheet>
            <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Abrir menu" title="Abrir menu" className="h-11 w-11 justify-self-end text-brand-ink hover:bg-brand-card"><Menu className="size-6" /></Button></SheetTrigger>
            <SheetContent aria-describedby={undefined} className="overflow-y-auto bg-brand-cream font-brand text-brand-ink">
              <SheetTitle className="text-brand-ink">Menu</SheetTitle>
              <nav className="mt-8 flex flex-col gap-2" aria-label="Menu principal">
                {nav.map((n) => <SheetClose key={n.label} asChild><Link to={n.to} className="rounded-md px-4 py-3 text-lg font-semibold hover:bg-brand-card" activeProps={{ className: "bg-brand-card" }}>{n.label}</Link></SheetClose>)}
              </nav>
            </SheetContent>
          </Sheet>
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

export function Meta({ title, desc, tag, big, by = "Por Alessandro 23/10/2026" }: { title: string; desc: string; tag: string; big?: boolean; by?: string }) {
  return (
    <>
      <p className="text-xs opacity-60">{by}</p>
      <h2 className={`mt-2 font-bold ${big ? "text-3xl" : "text-xl"}`}>{title}</h2>
      <p className="mt-2">{desc}</p>
      <span className="mt-4 w-fit rounded-full bg-brand-cream px-4 py-1 text-xs font-bold">{tag}</span>
    </>
  );
}
