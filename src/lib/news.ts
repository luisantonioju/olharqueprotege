import { XMLParser } from "fast-xml-parser";

export const NEWS_QUERY =
  '("proteção infantil" OR "segurança digital" OR cyberbullying OR "ECA Digital") (crianças OR adolescentes) Brasil when:30d';

export type NewsItem = { title: string; link: string; source: string; date: string };

type Raw = { title?: unknown; link?: unknown; pubDate?: unknown; source?: unknown };

const text = (v: unknown): string =>
  typeof v === "string" ? v : typeof v === "object" && v && "#text" in v ? String((v as { "#text": unknown })["#text"]) : "";

export function parseNewsFeed(xml: string): NewsItem[] {
  const doc = new XMLParser({ ignoreAttributes: true }).parse(xml) as { rss?: { channel?: { item?: Raw | Raw[] } } };
  const raw = doc.rss?.channel?.item;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list
    .map((i) => {
      const source = text(i.source);
      let title = text(i.title);
      if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -source.length - 3);
      return { title, link: text(i.link), source, date: text(i.pubDate) };
    })
    .filter((i) => i.title && i.link.startsWith("https://"))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
