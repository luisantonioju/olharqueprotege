import { embedUrl } from "@/lib/video-url";

export function VideoPlayer({ kind, providerId, src, poster, title, eager }: { kind: string; providerId: string | null; src: string | null; poster?: string | null | undefined; title: string; eager?: boolean }) {
  const embed = embedUrl(kind, providerId);
  if (embed) return <iframe src={embed} title={title} loading={eager ? "eager" : "lazy"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" className="aspect-video w-full border-0 bg-brand-ink" />;
  if (src) return <video src={src} poster={poster ?? undefined} controls preload="metadata" playsInline className="aspect-video w-full bg-brand-ink" />;
  return <div className="flex aspect-video w-full items-center justify-center bg-brand-ink text-sm text-brand-white">Vídeo indisponível</div>;
}
