import { createServerFn } from "@tanstack/react-start";
import { parseNewsFeed, NEWS_QUERY, type NewsItem } from "./news";

export const getNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: NewsItem[]; error?: string }> => {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(NEWS_QUERY)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 OlharQueProtege" } });
      if (!res.ok) {
        console.error(`Google News failed [${res.status}]`);
        return { items: [], error: "Não foi possível carregar as notícias agora." };
      }
      return { items: parseNewsFeed(await res.text()).slice(0, 12) };
    } catch (e) {
      console.error("Google News error", e);
      return { items: [], error: "Não foi possível carregar as notícias agora." };
    }
  },
);