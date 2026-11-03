import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Logo } from "@/components/site";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { isTeamMember } from "@/lib/auth";
import { postsQuery } from "@/lib/posts-query";

export const Route = createFileRoute("/_authenticated/admin/painel")({
  head: () => ({ meta: [
    { title: "Dashboard da Equipe — Olhar Que Protege" },
    { name: "description", content: "Gerencie as notícias publicadas no Blog." },
    { property: "og:title", content: "Dashboard da Equipe — Olhar Que Protege" },
    { property: "og:description", content: "Gerencie as notícias publicadas no Blog." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Painel,
});

type Draft = { id?: string; title: string; summary: string; link: string; source: string };
const empty: Draft = { title: "", summary: "", link: "", source: "Olhar Que Protege" };
const input = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring";

function Painel() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const team = useQuery({ queryKey: ["team"], queryFn: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user ? { email: data.user.email, ok: await isTeamMember(data.user.id) } : { email: "", ok: false };
  } });
  const posts = useQuery(postsQuery);
  const [draft, setDraft] = useState<Draft>(empty);
  const [msg, setMsg] = useState("");

  async function sair() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }
  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const link = draft.link.trim();
    if (link && !/^https:\/\//.test(link)) return setMsg("O link precisa começar com https://");
    const row = { title: draft.title.trim(), summary: draft.summary.trim(), link: link || null, source: draft.source.trim() || "Olhar Que Protege", updated_at: new Date().toISOString() };
    const { data: u } = await supabase.auth.getUser();
    const { error } = draft.id
      ? await supabase.from("posts").update(row).eq("id", draft.id)
      : await supabase.from("posts").insert({ ...row, author_id: u.user?.id });
    if (error) return setMsg("Não foi possível salvar.");
    setMsg(draft.id ? "Notícia atualizada!" : "Notícia publicada no Blog!");
    setDraft(empty);
    void qc.invalidateQueries({ queryKey: ["posts"] });
  }
  async function excluir(id: string) {
    if (!confirm("Excluir esta notícia?")) return;
    await supabase.from("posts").delete().eq("id", id);
    void qc.invalidateQueries({ queryKey: ["posts"] });
  }

  if (team.isLoading) return <p className="p-10 text-center">Carregando…</p>;
  if (!team.data?.ok) return <div className="p-10 text-center"><p>Esta área é só para a equipe.</p><Link to="/admin/login" className="mt-4 inline-block underline">Entrar como equipe</Link></div>;

  return <div className="min-h-screen bg-muted text-foreground">
    <header className="flex items-center justify-between gap-4 bg-card px-4 py-4 shadow-sm sm:px-8">
      <Link to="/home"><Logo size={32} /></Link>
      <div className="flex items-center gap-3 text-sm"><span className="hidden sm:inline text-muted-foreground">{team.data.email}</span><Button variant="outline" onClick={() => void sair()}>Sair</Button></div>
    </header>
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={salvar} className="h-fit space-y-4 rounded-xl bg-card p-6 shadow-sm">
        <h1 className="text-xl font-bold">{draft.id ? "Editar notícia" : "Nova notícia"}</h1>
        <input required className={input} placeholder="Título" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <textarea rows={5} className={input} placeholder="Resumo" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
        <input className={input} placeholder="Link da notícia (https://...)" value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} />
        <input className={input} placeholder="Fonte (ex.: G1)" value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
        {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
        <div className="flex gap-2">
          <button className="flex-1 rounded-lg bg-brand-admin py-3 font-semibold text-brand-white">{draft.id ? "Salvar alterações" : "Publicar"}</button>
          {draft.id && <Button type="button" variant="outline" className="h-auto" onClick={() => setDraft(empty)}>Cancelar</Button>}
        </div>
      </form>
      <section>
        <h2 className="text-xl font-bold">Notícias da equipe no Blog</h2>
        {posts.data?.length === 0 && <p className="mt-4 text-muted-foreground">Nenhuma notícia publicada ainda.</p>}
        <ul className="mt-4 space-y-3">
          {posts.data?.map((p) => <li key={p.id} className="rounded-xl bg-card p-5 shadow-sm">
            <p className="text-xs text-muted-foreground">{p.source} · {new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
            <h3 className="mt-1 font-bold">{p.title}</h3>
            {p.summary && <p className="mt-1 line-clamp-2 text-sm">{p.summary}</p>}
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setMsg(""); setDraft({ id: p.id, title: p.title, summary: p.summary, link: p.link ?? "", source: p.source }); }}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => void excluir(p.id)}>Excluir</Button>
            </div>
          </li>)}
        </ul>
      </section>
    </main>
  </div>;
}
