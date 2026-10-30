import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
  head: () => ({
    meta: [
      { title: "Olhar Que Protege" },
      { name: "description", content: "Segurança digital para crianças e adolescentes." },
      { property: "og:title", content: "Olhar Que Protege" },
      { property: "og:description", content: "Segurança digital para crianças e adolescentes." },
    ],
  }),
});
