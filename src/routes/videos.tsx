import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site";
import { VideoPlayer } from "@/components/video-player";
import { videosQuery } from "@/lib/videos-query";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Vídeos — Olhar Que Protege" },
      { name: "description", content: "Vídeos educativos sobre segurança digital infantil." },
      { property: "og:title", content: "Vídeos — Olhar Que Protege" },
      { property: "og:description", content: "Vídeos educativos sobre segurança digital infantil." },
    ],
  }),
  component: Videos,
});

function Videos() {
  const { data, isLoading, isError } = useQuery(videosQuery);
  return (
    <SiteLayout>
      <h1 className="text-center text-5xl font-extrabold tracking-wide">VÍDEOS</h1>
      {isLoading && <p className="mt-10 text-center">Carregando vídeos…</p>}
      {isError && <p className="mt-10 text-center">Não foi possível carregar os vídeos.</p>}
      {data?.length === 0 && <p className="mt-10 text-center">Nenhum vídeo publicado ainda.</p>}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {data?.map((v, i) => <article id={v.provider_id ?? v.id} key={v.id} className={`min-w-0 overflow-hidden rounded-lg bg-brand-card ${i === 0 ? "md:col-span-2" : ""}`}>
          <VideoPlayer kind={v.kind} providerId={v.provider_id} src={v.fileUrl ?? (v.kind === "direct" ? v.source_url : null)} poster={v.thumbUrl} title={v.title} eager={i === 0} />
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-bold sm:text-xl">{v.title}</h2>
            {v.description && <p className="mt-2 whitespace-pre-line text-sm">{v.description}</p>}
            {v.source_url && v.kind !== "upload" && <a href={v.source_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">Abrir no site original <ArrowUpRight className="size-4" /></a>}
          </div>
        </article>)}
      </div>
    </SiteLayout>
  );
}
