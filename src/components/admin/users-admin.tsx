import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { field } from "./upload-bar";

const PAGE = 20;

export function UserStats() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    refetchInterval: 15_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_user_stats");
      if (error) throw error;
      return data[0] ?? { total: 0, online: 0 };
    },
  });
  return <div className="grid gap-4 sm:grid-cols-2">
    <div className="rounded-xl bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">Usuários cadastrados</p><p className="mt-1 text-3xl font-bold">{stats.data ? Number(stats.data.total) : "–"}</p></div>
    <div className="rounded-xl bg-card p-5 shadow-sm">
      <p className="flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-brand-admin" />Online agora (estimativa)</p>
      <p className="mt-1 text-3xl font-bold">{stats.data ? Number(stats.data.online) : "–"}</p>
      <p className="mt-1 text-xs text-muted-foreground">Usuários comuns com sessão ativa nos últimos 90 segundos. Equipe não é contada.</p>
    </div>
    {stats.isError && <p className="text-sm text-destructive">Não foi possível carregar os números.</p>}
  </div>;
}

export function UsersAdmin() {
  const [term, setTerm] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  useEffect(() => { const t = setTimeout(() => { setSearch(term.trim()); setPage(0); }, 300); return () => clearTimeout(t); }, [term]);
  const users = useQuery({
    queryKey: ["admin", "users", search, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_users", { _search: search, _offset: page * PAGE, _limit: PAGE });
      if (error) throw error;
      return data;
    },
  });
  const total = Number(users.data?.[0]?.total ?? 0);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  return <section className="space-y-4">
    <UserStats />
    <div className="rounded-xl bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Usuários comuns</h2>
        <input className={`${field} sm:max-w-xs`} placeholder="Buscar por nome ou e-mail" value={term} onChange={(e) => setTerm(e.target.value)} aria-label="Buscar usuários" />
      </div>
      {users.isLoading && <p className="mt-4 text-muted-foreground">Carregando…</p>}
      {users.isError && <p className="mt-4 text-destructive">Não foi possível carregar a lista.</p>}
      {users.data?.length === 0 && <p className="mt-4 text-muted-foreground">{search ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado ainda."}</p>}
      {!!users.data?.length && <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground"><tr><th className="py-2 pr-4">Nome</th><th className="py-2 pr-4">E-mail</th><th className="py-2">Cadastro</th></tr></thead>
          <tbody>{users.data.map((u) => <tr key={u.id} className="border-t border-input"><td className="py-2 pr-4">{u.full_name || "—"}</td><td className="py-2 pr-4 break-all">{u.email}</td><td className="py-2 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td></tr>)}</tbody>
        </table>
      </div>}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{total} resultado(s) · página {page + 1} de {pages}</span>
        <div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</Button><Button size="sm" variant="outline" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Próxima</Button></div>
      </div>
    </div>
  </section>;
}
