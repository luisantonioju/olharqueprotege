import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Meta } from "@/components/site";
import phone from "@/assets/phone.jpg";
import hero from "@/assets/hero.jpg";
import sisters from "@/assets/sisters.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Olhar Que Protege" },
      { name: "description", content: "Artigos sobre proteção infantil e segurança online." },
      { property: "og:title", content: "Blog — Olhar Que Protege" },
      { property: "og:description", content: "Artigos sobre proteção infantil e segurança online." },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <SiteLayout>
      <h1 className="text-center text-5xl font-extrabold tracking-wide">BLOG</h1>
      <article className="mt-10 grid overflow-hidden rounded-2xl bg-brand-card md:grid-cols-[2fr_3fr]">
        <img src={phone} alt="Celular com aplicativos" className="h-full w-full object-cover" />
        <div className="flex flex-col justify-center p-8">
          <Meta big by="Por Administrador · 23/10/2026" title="A Importância da Proteção Infantil" desc="Texto detalhado sobre a importância de proteger as crianças e criar um ambiente seguro..." tag="DESTAQUE" />
        </div>
      </article>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {[
          [hero, "22/10/2026", "Como Identificar Sinais de Alerta", "Texto sobre como perceber comportamentos e prevenir situações de risco..."],
          [sisters, "21/10/2026", "O Papel da Comunidade na Segurança", "Texto explicando como toda a sociedade pode contribuir no projeto Olhar Que Protege..."],
        ].map(([img, d, t, x]: string[]) => [img ?? "", d ?? "", t ?? "", x ?? ""] as const).map(([img, d, t, x]) => (
          <article key={t} className="overflow-hidden rounded-2xl bg-brand-card">
            <img src={img} alt={t} loading="lazy" className="h-48 w-full object-cover" />
            <div className="flex flex-col p-6"><Meta by={`Por Administrador · ${d}`} title={t} desc={x} tag="LEITURA" /></div>
          </article>
        ))}
      </div>
    </SiteLayout>
  );
}
