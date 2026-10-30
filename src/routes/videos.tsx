import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Meta } from "@/components/site";

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

const SAMPLE = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

function Videos() {
  return (
    <SiteLayout>
      <h1 className="text-center text-5xl font-extrabold tracking-wide">VÍDEOS</h1>
      <article className="mt-10 grid overflow-hidden rounded-2xl bg-brand-card md:grid-cols-[2fr_3fr]">
        <video controls src={SAMPLE} className="h-full w-full bg-brand-ink object-cover" />
        <div className="flex flex-col justify-center p-8">
          <Meta title="Terceiro Vídeo de Apresentação" desc="Breve descrição do Terceiro Vídeo Inicial de Apresentação" tag="DESTAQUE" big />
        </div>
      </article>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {[
          ["Segundo Vídeo de Apresentação", "Breve descrição do Segundo Vídeo Inicial de Apresentação"],
          ["Vídeo Inicial de Apresentação", "Breve descrição do Vídeo Inicial de Apresentação"],
        ].map(([t, d]: string[]) => (
          <article key={t} className="overflow-hidden rounded-2xl bg-brand-card">
            <video controls src={SAMPLE} className="aspect-video w-full bg-brand-ink object-cover" />
            <div className="p-6"><Meta title={t} desc={d} tag="VÍDEO" /></div>
          </article>
        ))}
      </div>
    </SiteLayout>
  );
}

