import { createServerFn } from "@tanstack/react-start";
import { parseNewsFeed, NEWS_QUERY, type NewsItem } from "./news";

export const getNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: NewsItem[]; error?: string }> => {
    const url = `https://www.bing.com/news/search?q=${encodeURIComponent(NEWS_QUERY)}&format=rss&cc=BR&setlang=pt-BR&qft=sortbydate%3d%221%22`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 OlharQueProtege" } });
      if (!res.ok) {
        console.error(`News feed failed [${res.status}]`);
        return { items: [], error: "Não foi possível carregar as notícias agora." };
      }
      return { items: parseNewsFeed(await res.text()).slice(0, 12) };
    } catch (e) {
      console.error("News feed error", e);
      return { items: [], error: "Não foi possível carregar as notícias agora." };
    }
  },
);
