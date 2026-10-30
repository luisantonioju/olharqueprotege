import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Olhar Que Protege" },
      { name: "description", content: "Segurança digital para crianças e adolescentes." },
      { property: "og:title", content: "Olhar Que Protege" },
      { property: "og:description", content: "Segurança digital para crianças e adolescentes." },
    ],
  }),
});
