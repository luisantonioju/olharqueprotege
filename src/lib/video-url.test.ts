import { describe, expect, it } from "vitest";
import { checkFile, embedUrl, parseVideoUrl } from "./video-url";

describe("parseVideoUrl", () => {
  it("normalizes YouTube links", () => {
    expect(parseVideoUrl("https://www.youtube.com/watch?v=gRxnqOVsqfo&t=3")?.providerId).toBe("gRxnqOVsqfo");
    expect(parseVideoUrl("https://youtu.be/8vlPYxH0pFU")?.providerId).toBe("8vlPYxH0pFU");
  });
  it("accepts Vimeo and direct mp4", () => {
    expect(parseVideoUrl("https://vimeo.com/76979871")?.kind).toBe("vimeo");
    expect(parseVideoUrl("https://cdn.test/a.mp4")?.kind).toBe("direct");
  });
  it("rejects arbitrary or insecure links", () => {
    expect(parseVideoUrl("https://evil.test/page")).toBeNull();
    expect(parseVideoUrl("http://youtu.be/8vlPYxH0pFU")).toBeNull();
    expect(embedUrl("youtube", "<script>")).toBeNull();
  });
});

describe("checkFile", () => {
  it("limits videos to 50 MB and images to 10 MB", () => {
    expect(checkFile({ type: "video/mp4", size: 51 * 1024 * 1024 }, "video")).not.toBeNull();
    expect(checkFile({ type: "image/png", size: 11 * 1024 * 1024 }, "image")).not.toBeNull();
    expect(checkFile({ type: "application/pdf", size: 10 }, "image")).not.toBeNull();
    expect(checkFile({ type: "image/png", size: 1000 }, "image")).toBeNull();
  });
});
