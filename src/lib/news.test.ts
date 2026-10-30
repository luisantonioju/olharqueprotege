import { describe, expect, it } from "vitest";
import { parseNewsFeed } from "./news";

describe("parseNewsFeed", () => {
  it("puts the most recent news first and removes the source suffix", () => {
    const xml = `<rss><channel>
      <item><title>Antiga - G1</title><link>https://a.test</link><pubDate>Mon, 01 Jan 2026 10:00:00 GMT</pubDate><source url="x">G1</source></item>
      <item><title>Nova - CNN</title><link>https://b.test</link><pubDate>Fri, 30 Oct 2026 10:00:00 GMT</pubDate><source url="y">CNN</source></item>
    </channel></rss>`;
    const items = parseNewsFeed(xml);
    expect(items.map((i) => i.title)).toEqual(["Nova", "Antiga"]);
    expect(items[0]?.source).toBe("CNN");
  });
});