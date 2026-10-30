import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site";
import { VIDEOS } from "@/lib/content";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Vídeos — Olhar Que Protege" },
      { name: "description", content: "Vídeos educativos sobre segurança digital infantil." },
      { property: "og:title", content: "Vídeos — Olhar Que Protege" },
      { property: "og:description", content: "Vídeos educativos sobre segurança digital infantil." },
    ],
  }),
  component: Videos,
});

function Videos() {
  return (
    <SiteLayout>
      <h1 className="text-center text-5xl font-extrabold tracking-wide">VÍDEOS</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {VIDEOS.map((v, i) => <article id={v.id} key={v.id} className={`min-w-0 overflow-hidden rounded-lg bg-brand-card ${i === 0 ? "md:col-span-2" : ""}`}>
          <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}`} title={v.title} loading={i ? "lazy" : "eager"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="aspect-video w-full border-0 bg-brand-ink" />
          <div className="p-5 sm:p-6"><h2 className="text-lg font-bold sm:text-xl">{v.title}</h2><p className="mt-2 text-sm">{v.desc}</p><a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">Assistir no YouTube <ArrowUpRight className="size-4" /></a></div>
        </article>)}
      </div>
    </SiteLayout>
  );
}

