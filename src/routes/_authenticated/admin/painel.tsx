import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Logo } from "@/components/site";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { isTeamMember } from "@/lib/auth";
import { PostsAdmin } from "@/components/admin/posts-admin";
import { VideosAdmin } from "@/components/admin/videos-admin";
import { UsersAdmin, UserStats } from "@/components/admin/users-admin";

export const Route = createFileRoute("/_authenticated/admin/painel")({
  head: () => ({ meta: [
    { title: "Dashboard da Equipe — Olhar Que Protege" },
    { name: "description", content: "Gerencie publicações, vídeos e usuários." },
    { property: "og:title", content: "Dashboard da Equipe — Olhar Que Protege" },
    { property: "og:description", content: "Gerencie publicações, vídeos e usuários." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Painel,
});

const TABS = [["blog", "Blog"], ["videos", "Vídeos"], ["usuarios", "Usuários"]] as const;

function Painel() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("blog");
  const team = useQuery({ queryKey: ["team"], queryFn: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user ? { email: data.user.email, ok: await isTeamMember(data.user.id) } : { email: "", ok: false };
  } });
  async function sair() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }
  if (team.isLoading) return <p className="p-10 text-center">Carregando…</p>;
  if (!team.data?.ok) return <div className="p-10 text-center"><p>Esta área é só para a equipe.</p><Link to="/admin/login" className="mt-4 inline-block underline">Entrar como equipe</Link></div>;
  return <div className="min-h-screen bg-muted text-foreground">
    <header className="flex items-center justify-between gap-4 bg-card px-4 py-4 shadow-sm sm:px-8">
      <Link to="/home"><Logo size={32} /></Link>
      <div className="flex items-center gap-3 text-sm"><span className="hidden sm:inline text-muted-foreground">{team.data.email}</span><Button variant="outline" onClick={() => void sair()}>Sair</Button></div>
    </header>
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Dashboard da Equipe</h1>
      {tab !== "usuarios" && <UserStats />}
      <nav className="flex flex-wrap gap-2" role="tablist">{TABS.map(([k, l]) => <Button key={k} role="tab" aria-selected={tab === k} variant={tab === k ? "default" : "outline"} onClick={() => setTab(k)}>{l}</Button>)}</nav>
      {tab === "blog" && <PostsAdmin />}
      {tab === "videos" && <VideosAdmin />}
      {tab === "usuarios" && <UsersAdmin />}
    </main>
  </div>;
}
