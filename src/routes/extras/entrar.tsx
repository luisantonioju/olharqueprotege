import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, Logo } from "@/components/site";

export const Route = createFileRoute("/extras/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Olhar Que Protege" },
      { name: "description", content: "Entre na sua conta do Olhar Que Protege." },
      { property: "og:title", content: "Entrar — Olhar Que Protege" },
      { property: "og:description", content: "Entre na sua conta do Olhar Que Protege." },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const [msg, setMsg] = useState("");
  return (
    <AuthCard>
      <div className="flex justify-center"><Logo /></div>
      <p className="mt-10 text-center text-xs font-bold tracking-[0.25em] text-brand-accent">BEM-VINDO DE VOLTA</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Que bom ter você aqui!</h1>
      <p className="mt-3 text-center text-sm opacity-70">Entre na sua conta para continuar acessando os conteúdos exclusivos do Olhar Que Protege.</p>
      <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setMsg("Login recebido!"); }}>
        <Field label="E-mail" type="email" placeholder="seuemail@olharqueprotege.com" />
        <Field label="Senha" type="password" placeholder="Sua senha" />
        {msg && <p className="text-center text-sm font-bold text-brand-accent">{msg}</p>}
        <button className="w-full rounded-lg bg-brand-accent py-3 font-bold text-brand-white">Entrar na minha conta</button>
      </form>
      <p className="mt-6 text-center text-sm opacity-80">Ainda não tem uma conta? <Link to="/extras/cadastro" className="font-bold text-brand-accent">Cadastre-se</Link></p>
      <p className="mt-4 text-center text-sm"><Link to="/home" className="font-bold text-brand-accent">← Voltar para a página inicial</Link></p>
    </AuthCard>
  );
}
