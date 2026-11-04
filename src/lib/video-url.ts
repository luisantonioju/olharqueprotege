export type ParsedVideo =
  | { kind: "youtube"; providerId: string; url: string }
  | { kind: "vimeo"; providerId: string; url: string }
  | { kind: "direct"; providerId: null; url: string };

/** Only known providers become embeds; anything else is rejected. */
export function parseVideoUrl(raw: string): ParsedVideo | null {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^(www\.|m\.)/, "");
  const yt = /^[\w-]{11}$/;
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id = u.pathname === "/watch" ? u.searchParams.get("v") : u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1];
    return id && yt.test(id) ? { kind: "youtube", providerId: id, url: `https://www.youtube.com/watch?v=${id}` } : null;
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0] ?? "";
    return yt.test(id) ? { kind: "youtube", providerId: id, url: `https://www.youtube.com/watch?v=${id}` } : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = u.pathname.match(/^\/(?:video\/)?(\d{6,12})(?:\/|$)/)?.[1];
    return id ? { kind: "vimeo", providerId: id, url: `https://vimeo.com/${id}` } : null;
  }
  if (/\.(mp4|webm|ogg)$/i.test(u.pathname)) return { kind: "direct", providerId: null, url: u.href };
  return null;
}

export function embedUrl(kind: string, providerId: string | null) {
  if (!providerId) return null;
  if (kind === "youtube" && /^[\w-]{11}$/.test(providerId)) return `https://www.youtube-nocookie.com/embed/${providerId}`;
  if (kind === "vimeo" && /^\d+$/.test(providerId)) return `https://player.vimeo.com/video/${providerId}`;
  return null;
}

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
export const MAX_IMAGE = 10 * 1024 * 1024;
export const MAX_VIDEO = 50 * 1024 * 1024;

export function checkFile(file: { type: string; size: number }, kind: "image" | "video"): string | null {
  const types = kind === "image" ? IMAGE_TYPES : VIDEO_TYPES;
  const max = kind === "image" ? MAX_IMAGE : MAX_VIDEO;
  if (!types.includes(file.type)) return kind === "image" ? "Use fotos JPG, PNG, WEBP ou GIF." : "Use vídeos MP4, WEBM ou OGG.";
  if (file.size > max) return `Arquivo maior que ${max / 1024 / 1024} MB.`;
  return null;
}
