import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PAGES, VIDEOS } from "@/lib/content";
import { newsQuery } from "@/lib/news-query";

const normalize = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isFetching } = useQuery({ ...newsQuery, enabled: open });
  const q = normalize(search.trim());
  const pages = PAGES.filter((p) => !q || normalize(p.label + " " + p.text).includes(q));
  const videos = q ? VIDEOS.filter((v) => normalize(v.title + " " + v.desc).includes(q)) : [];
  const news = q ? data?.items.filter((n) => normalize(n.title + " " + n.source).includes(q)) ?? [] : [];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Buscar no site" title="Buscar no site" className="h-11 w-11 text-brand-ink hover:bg-brand-card"><Search className="size-6" /></Button></DialogTrigger>
      <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-xl rounded-lg bg-brand-cream font-brand text-brand-ink">
        <DialogTitle>Buscar no site</DialogTitle>
        <label className="flex items-center gap-3 border-b border-brand-accent py-3"><Search className="size-5 shrink-0" /><input aria-label="O que você procura?" placeholder="O que você procura?" value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 w-full bg-transparent outline-none" /></label>
        <div className="max-h-[55dvh] overflow-y-auto">
          {pages.length > 0 && <p className="mb-2 text-xs font-bold opacity-60">PÁGINAS</p>}
          {pages.map((p) => <Link key={p.to} to={p.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 hover:bg-brand-card"><span className="font-semibold">{p.label}</span><span className="mt-1 block text-xs opacity-70">{p.text}</span></Link>)}
          {videos.length > 0 && <p className="mb-2 mt-4 text-xs font-bold opacity-60">VÍDEOS</p>}
          {videos.map((v) => <Link key={v.id} to="/videos" hash={v.id} onClick={() => setOpen(false)} className="block px-3 py-3 text-sm hover:bg-brand-card">{v.title}</Link>)}
          {news.length > 0 && <p className="mb-2 mt-4 text-xs font-bold opacity-60">NOTÍCIAS</p>}
          {news.map((n) => <a key={n.link} href={n.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 px-3 py-3 text-sm hover:bg-brand-card">{n.title}<ArrowUpRight className="size-4 shrink-0" /></a>)}
          {q && !pages.length && !videos.length && !news.length && <p className="py-6 text-sm">{isFetching ? "Buscando notícias…" : "Nenhum resultado encontrado."}</p>}
          {data?.error && <p className="mt-4 text-xs opacity-70">As notícias estão indisponíveis; a busca nas páginas e vídeos continua disponível.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}