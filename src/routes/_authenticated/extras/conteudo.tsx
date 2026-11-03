import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { VIDEOS } from "@/lib/content";

export const Route = createFileRoute("/_authenticated/extras/conteudo")({
  head: () => ({ meta: [
    { title: "Extras exclusivos — Olhar Que Protege" },
    { name: "description", content: "Conteúdos exclusivos para quem tem conta no Olhar Que Protege." },
    { property: "og:title", content: "Extras exclusivos — Olhar Que Protege" },
    { property: "og:description", content: "Conteúdos exclusivos para quem tem conta no Olhar Que Protege." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Extras,
});

const tips = [
  "Converse diariamente com seu filho sobre o que ele vê na internet.",
  "Ative o controle parental (Google Family Link ou Tempo de Uso no iPhone).",
  "Mantenha computadores e celulares em áreas comuns da casa.",
  "Ensine a nunca compartilhar fotos, endereço ou escola com desconhecidos.",
  "Combine horários de uso de telas e dê o exemplo.",
  "Em caso de abuso ou exploração, denuncie pelo Disque 100 ou SaferNet.",
];

function Extras() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function sair() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/extras/entrar", replace: true });
  }
  return <SiteLayout>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-4xl font-extrabold">EXTRAS</h1>
      <Button variant="ghost" onClick={() => void sair()} className="text-brand-ink hover:bg-brand-card">Sair da conta</Button>
    </div>
    <section className="mt-8 rounded-lg bg-brand-card p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Guia rápido de proteção em família</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5">{tips.map((t) => <li key={t}>{t}</li>)}</ol>
    </section>
    <section className="mt-8 grid gap-5 md:grid-cols-2">
      <a href="https://new.safernet.org.br/denuncie" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-brand-cream p-6 font-bold hover:underline">Denunciar na SaferNet Brasil ↗</a>
      <a href="https://www.gov.br/mdh/pt-br/ondh" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-brand-cream p-6 font-bold hover:underline">Disque 100 — Direitos Humanos ↗</a>
    </section>
    <p className="mt-8">Assista também aos <Link to="/videos" className="font-bold underline">{VIDEOS.length} vídeos</Link> e às <Link to="/blog" className="font-bold underline">notícias do Blog</Link>.</p>
  </SiteLayout>;
}
