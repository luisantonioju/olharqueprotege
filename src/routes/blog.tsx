import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/posts-query";
import { ArrowUpRight, RefreshCw, Newspaper } from "lucide-react";
import { SiteLayout } from "@/components/site";
import { Button } from "@/components/ui/button";
import { newsQuery } from "@/lib/news-query";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [
    { title: "Blog e notícias do Brasil — Olhar Que Protege" },
    { name: "description", content: "Últimas notícias brasileiras sobre proteção infantil e segurança digital, reunidas pelo Google Notícias." },
    { property: "og:title", content: "Blog e notícias do Brasil — Olhar Que Protege" },
    { property: "og:description", content: "Acompanhe notícias de proteção de crianças e adolescentes no ambiente digital no Brasil." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQuery),
  component: Blog,
});

function TeamPosts() {
  const { data } = useQuery(postsQuery);
  if (!data?.length) return null;
  return <section className="mt-10">
    <h2 className="border-b border-brand-accent/30 pb-5 text-xl font-bold">Publicações da equipe</h2>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      {data.map((p) => <article key={p.id} className="flex min-w-0 flex-col rounded-lg bg-brand-cream p-6">
        <p className="text-xs font-semibold opacity-70">{p.source} · {new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
        {p.imageUrls.length > 0 && <figure className="mt-4">
          <div className={`grid gap-2 ${p.imageUrls.length > 1 ? "grid-cols-2" : ""}`}>
            {p.imageUrls.map((u, k) => <img key={u} src={u} alt={p.caption || p.title} loading="lazy" className={`w-full rounded-md object-cover ${k === 0 && p.imageUrls.length > 1 ? "col-span-2 aspect-video" : "aspect-video"}`} />)}
          </div>
          {p.caption && <figcaption className="mt-2 text-xs opacity-70">{p.caption}</figcaption>}
        </figure>}
        <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
        {p.summary && <p className="mt-2 whitespace-pre-line font-medium">{p.summary}</p>}
        {p.content && <p className="mt-3 whitespace-pre-line text-sm">{p.content}</p>}
        {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold underline underline-offset-4">Ler notícia <ArrowUpRight className="size-4" /></a>}
      </article>)}
    </div>
  </section>;
}

function Blog() {
  const { data, refetch, isFetching } = useSuspenseQuery(newsQuery);
  return <SiteLayout>
    <h1 className="text-center text-4xl font-extrabold sm:text-5xl">BLOG</h1>
    <TeamPosts />
    <div className="mt-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-brand-accent/30 pb-5">
      <div className="min-w-0"><h2 className="text-xl font-bold">Últimas notícias no Brasil</h2><p className="mt-2 text-xs opacity-70">Google Notícias · Proteção infantil e segurança digital</p></div>
      <Button variant="ghost" size="icon" aria-label="Atualizar notícias" title="Atualizar notícias" disabled={isFetching} onClick={() => void refetch()} className="text-brand-ink hover:bg-brand-cream"><RefreshCw className={isFetching ? "animate-spin" : ""} /></Button>
    </div>
    {data.error && <div role="status" className="py-12 text-center"><Newspaper className="mx-auto mb-4 size-8" /><p>{data.error}</p><Button variant="ghost" onClick={() => void refetch()} className="mt-4 text-brand-ink">Tentar novamente</Button></div>}
    {!data.error && !data.items.length && <p className="py-12 text-center">Nenhuma notícia recente encontrada.</p>}
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      {data.items.map((n, i) => <article key={n.link} className={`flex min-w-0 flex-col rounded-lg bg-brand-card p-6 ${i === 0 ? "md:col-span-2 sm:p-8" : ""}`}>
        <p className="text-xs font-semibold opacity-70">{n.source}{Number.isFinite(Date.parse(n.date)) && <> · {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "America/Sao_Paulo" }).format(new Date(n.date))}</>}</p>
        <h3 className={`mt-3 font-bold ${i === 0 ? "text-xl sm:text-2xl" : "text-lg"}`}><a href={n.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{n.title}</a></h3>
        <a href={n.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold underline underline-offset-4">Ler notícia <ArrowUpRight className="size-4" /></a>
      </article>)}
    </div>
  </SiteLayout>;
}