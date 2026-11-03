import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, Field, Logo } from "@/components/site";
import { supabase } from "@/integrations/supabase/client";
import { authErrorMessage } from "@/lib/auth";

export const Route = createFileRoute("/extras/cadastro")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthCard>
      <div className="flex justify-center"><Logo /></div>
      <p className="mt-10 text-center text-xs font-bold tracking-[0.25em] text-brand-accent">JUNTE-SE A NÓS</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Crie sua conta</h1>
      <p className="mt-3 text-center text-sm opacity-70">Cadastre-se para começar a acessar os conteúdos exclusivos do Olhar Que Protege.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          if (f.get("password") !== f.get("confirm")) return setMsg("As senhas não conferem.");
          setBusy(true); setMsg("");
          const { data, error } = await supabase.auth.signUp({
            email: String(f.get("email")).trim(),
            password: String(f.get("password")),
            options: { emailRedirectTo: `${window.location.origin}/extras/conteudo`, data: { full_name: String(f.get("name")) } },
          });
          setBusy(false);
          if (error) return setMsg(authErrorMessage(error.message));
          if (data.session) return navigate({ to: "/extras/conteudo" });
          setMsg("Quase lá! Enviamos um link para seu e-mail. Confirme para acessar os Extras.");
        }}
      >
        <Field label="Nome completo" name="name" placeholder="Seu nome completo" />
        <Field label="E-mail" type="email" placeholder="seuemail@olharqueprotege.com" />
        <Field label="Senha" type="password" placeholder="Mínimo de 8 caracteres" />
        <Field label="Confirme a senha" type="password" name="confirm" placeholder="Repita sua senha" />
        {msg && <p role="alert" className="text-center text-sm font-bold text-brand-accent">{msg}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-brand-accent py-3 font-bold text-brand-white disabled:opacity-60">{busy ? "Criando…" : "Criar minha conta"}</button>
      </form>
      <p className="mt-6 text-center text-sm opacity-80">Já possui uma conta? <Link to="/extras/entrar" className="font-bold text-brand-accent">Entrar</Link></p>
      <p className="mt-4 text-center text-sm"><Link to="/home" className="font-bold text-brand-accent">← Voltar para a página inicial</Link></p>
    </AuthCard>
  );
}
