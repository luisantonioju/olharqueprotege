import { XMLParser } from "fast-xml-parser";

export const NEWS_QUERY = '"proteção infantil" OR "ECA Digital" OR "segurança digital" crianças';

export type NewsItem = { title: string; link: string; source: string; date: string; summary?: string };

type Raw = { title?: unknown; link?: unknown; pubDate?: unknown; source?: unknown; "News:Source"?: unknown; description?: unknown };

const text = (v: unknown): string =>
  typeof v === "string" ? v : typeof v === "object" && v && "#text" in v ? String((v as { "#text": unknown })["#text"]) : "";

/** Turns aggregator redirect links into the original site address. */
export function directLink(link: string): string {
  try {
    const u = new URL(link);
    const target = u.searchParams.get("url");
    if (target && /^https?:\/\//.test(target)) return target.replace(/^http:/, "https:");
  } catch {
    return "";
  }
  return link;
}

export function parseNewsFeed(xml: string): NewsItem[] {
  const doc = new XMLParser({ ignoreAttributes: true }).parse(xml) as { rss?: { channel?: { item?: Raw | Raw[] } } };
  const raw = doc.rss?.channel?.item;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const seen = new Set<string>();
  return list
    .map((i) => {
      const source = text(i.source) || text(i["News:Source"]);
      let title = text(i.title);
      if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -source.length - 3);
      return { title, link: directLink(text(i.link)), source, date: text(i.pubDate), summary: text(i.description) };
    })
    .filter((i) => i.title && i.link.startsWith("https://") && !seen.has(i.link) && seen.add(i.link))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
