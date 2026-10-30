import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, Logo } from "@/components/site";

export const Route = createFileRoute("/extras/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro — Olhar Que Protege" },
      { name: "description", content: "Crie sua conta no Olhar Que Protege." },
      { property: "og:title", content: "Cadastro — Olhar Que Protege" },
      { property: "og:description", content: "Crie sua conta no Olhar Que Protege." },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const [msg, setMsg] = useState("");
  return (
    <AuthCard>
      <div className="flex justify-center"><Logo /></div>
      <p className="mt-10 text-center text-xs font-bold tracking-[0.25em] text-brand-accent">JUNTE-SE A NÓS</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Crie sua conta</h1>
      <p className="mt-3 text-center text-sm opacity-70">Cadastre-se para começar a acessar os conteúdos exclusivos do Olhar Que Protege.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const p = [...e.currentTarget.querySelectorAll<HTMLInputElement>("input[type=password]")];
          setMsg(p[0].value !== p[1].value ? "As senhas não conferem." : "Cadastro recebido!");
        }}
      >
        <Field label="Nome completo" placeholder="Seu nome completo" />
        <Field label="E-mail" type="email" placeholder="seuemail@olharqueprotege.com" />
        <Field label="Senha" type="password" placeholder="Mínimo de 8 caracteres" />
        <Field label="Confirme a senha" type="password" placeholder="Repita sua senha" />
        {msg && <p className="text-center text-sm font-bold text-brand-accent">{msg}</p>}
        <button className="w-full rounded-lg bg-brand-accent py-3 font-bold text-brand-white">Criar minha conta</button>
      </form>
      <p className="mt-6 text-center text-sm opacity-80">Já possui uma conta? <Link to="/extras/entrar" className="font-bold text-brand-accent">Entrar</Link></p>
      <p className="mt-4 text-center text-sm"><Link to="/home" className="font-bold text-brand-accent">← Voltar para a página inicial</Link></p>
    </AuthCard>
  );
}
