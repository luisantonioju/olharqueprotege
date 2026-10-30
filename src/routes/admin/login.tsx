import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Field, Logo } from "@/components/site";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Painel da Equipe — Olhar Que Protege" },
      { name: "description", content: "Acesso restrito para administradores." },
      { property: "og:title", content: "Painel da Equipe — Olhar Que Protege" },
      { property: "og:description", content: "Acesso restrito para administradores." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const [msg, setMsg] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 text-foreground">
      <div className="w-full max-w-md rounded-xl bg-card p-10 shadow-md">
        <div className="flex justify-center"><Logo size={28} /></div>
        <h1 className="mt-6 text-center text-2xl font-bold">Painel da Equipe</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Acesso restrito para administradores</p>
        <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setMsg("Acesso ainda não configurado."); }}>
          <Field label="E-mail" type="email" />
          <Field label="Senha" type="password" />
          {msg && <p className="text-center text-sm text-muted-foreground">{msg}</p>}
          <button className="w-full rounded-lg bg-brand-admin py-3 font-semibold text-brand-white">Entrar na Equipe</button>
        </form>
        <p className="mt-6 text-center text-sm"><Link to="/home" className="text-brand-admin">← Voltar para a página inicial</Link></p>
      </div>
    </div>
  );
}
