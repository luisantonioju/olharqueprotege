import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { adminPostsQuery } from "@/lib/posts-query";
import { removeFiles, signedUrls, uploadFile } from "@/lib/media";
import { checkFile } from "@/lib/video-url";
import { field, StatusBadge, UploadBar, type UploadState } from "./upload-bar";

type Draft = { id?: string; title: string; summary: string; content: string; caption: string; link: string; source: string; images: string[] };
const empty: Draft = { title: "", summary: "", content: "", caption: "", link: "", source: "Olhar Que Protege", images: [] };

export function PostsAdmin() {
  const qc = useQueryClient();
  const posts = useQuery(adminPostsQuery);
  const [draft, setDraft] = useState<Draft>(empty);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploads, setUploads] = useState<Record<string, UploadState>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const uploading = Object.values(uploads).some((u) => !u.error);

  function startUpload(file: File, key = crypto.randomUUID()) {
    const preview = URL.createObjectURL(file);
    const task = uploadFile("blog-media", file, (pct) => setUploads((s) => ({ ...s, [key]: { ...s[key]!, pct } })));
    setUploads((s) => ({ ...s, [key]: { name: file.name, pct: 0, abort: task.abort } }));
    task.promise.then((path) => {
      setPreviews((p) => ({ ...p, [path]: preview }));
      setDraft((d) => ({ ...d, images: [...d.images, path] }));
      setUploads((s) => { const n = { ...s }; delete n[key]; return n; });
    }).catch((e: Error) => setUploads((s) => ({ ...s, [key]: { name: file.name, pct: 0, error: e.message, retry: () => startUpload(file, key) } })));
  }

  function pick(files: FileList | null) {
    setMsg("");
    for (const f of Array.from(files ?? [])) {
      const err = checkFile(f, "image");
      if (err) { setMsg(`${f.name}: ${err}`); continue; }
      startUpload(f);
    }
  }

  async function edit(id: string) {
    const p = posts.data?.find((x) => x.id === id);
    if (!p) return;
    setMsg(""); setUploads({});
    setPreviews(await signedUrls("blog-media", p.imagePaths));
    setDraft({ id: p.id, title: p.title, summary: p.summary, content: p.content, caption: p.caption, link: p.link ?? "", source: p.source, images: p.imagePaths });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(status: "draft" | "published") {
    if (!draft.title.trim()) return setMsg("Informe o título.");
    const link = draft.link.trim();
    if (link && !/^https:\/\//.test(link)) return setMsg("O link precisa começar com https://");
    if (uploading) return setMsg("Aguarde o envio das fotos terminar.");
    setBusy(true);
    const row = { title: draft.title.trim(), summary: draft.summary.trim(), content: draft.content.trim(), caption: draft.caption.trim(), link: link || null, source: draft.source.trim() || "Olhar Que Protege", images: draft.images, status, updated_at: new Date().toISOString() };
    const { data: u } = await supabase.auth.getUser();
    const { error } = draft.id
      ? await supabase.from("posts").update(row).eq("id", draft.id)
      : await supabase.from("posts").insert({ ...row, author_id: u.user?.id ?? null });
    setBusy(false);
    if (error) return setMsg("Não foi possível salvar. Verifique sua conexão e permissão.");
    setMsg(status === "published" ? "Publicação no ar no Blog!" : "Rascunho salvo.");
    setDraft(empty); setPreviews({});
    void qc.invalidateQueries({ queryKey: ["posts"] });
  }

  async function toggle(id: string, status: string) {
    const { error } = await supabase.from("posts").update({ status: status === "published" ? "draft" : "published", updated_at: new Date().toISOString() }).eq("id", id);
    if (error) setMsg("Não foi possível alterar o status.");
    void qc.invalidateQueries({ queryKey: ["posts"] });
  }

  async function remove(id: string, images: string[]) {
    if (!confirm("Excluir esta publicação e suas fotos? Essa ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return setMsg("Não foi possível excluir.");
    await removeFiles("blog-media", images);
    if (draft.id === id) setDraft(empty);
    void qc.invalidateQueries({ queryKey: ["posts"] });
  }

  return <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
    <form onSubmit={(e) => { e.preventDefault(); void save("published"); }} className="h-fit space-y-4 rounded-xl bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold">{draft.id ? "Editar publicação" : "Nova publicação"}</h2>
      <input required className={field} placeholder="Título" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      <textarea rows={2} className={field} placeholder="Descrição curta" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
      <textarea rows={6} className={field} placeholder="Texto da publicação" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
      <div>
        <label className="text-sm font-semibold">Fotos (JPG, PNG, WEBP ou GIF até 10 MB)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="mt-2 block w-full text-sm" onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
      </div>
      {Object.entries(uploads).map(([k, u]) => <UploadBar key={k} u={u} />)}
      {draft.images.length > 0 && <div className="grid grid-cols-3 gap-2">
        {draft.images.map((p) => <div key={p} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {previews[p] && <img src={previews[p]} alt="" className="h-full w-full object-cover" />}
          <button type="button" aria-label="Remover foto" onClick={() => setDraft({ ...draft, images: draft.images.filter((x) => x !== p) })} className="absolute right-1 top-1 rounded-full bg-card p-1 shadow"><X className="size-3" /></button>
        </div>)}
      </div>}
      <input className={field} placeholder="Legenda das fotos" value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} />
      <input className={field} placeholder="Link externo (https://...) — opcional" value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} />
      <input className={field} placeholder="Fonte (ex.: G1)" value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
      {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
      <div className="flex flex-wrap gap-2">
        <button disabled={busy || uploading} className="flex-1 rounded-lg bg-brand-admin py-3 font-semibold text-brand-white disabled:opacity-60">Publicar</button>
        <Button type="button" variant="outline" className="h-auto" disabled={busy || uploading} onClick={() => void save("draft")}>Salvar rascunho</Button>
        {draft.id && <Button type="button" variant="ghost" className="h-auto" onClick={() => { setDraft(empty); setUploads({}); }}>Cancelar</Button>}
      </div>
    </form>
    <section>
      <h2 className="text-xl font-bold">Publicações do Blog</h2>
      {posts.isLoading && <p className="mt-4 text-muted-foreground">Carregando…</p>}
      {posts.isError && <p className="mt-4 text-destructive">Não foi possível carregar as publicações.</p>}
      {posts.data?.length === 0 && <p className="mt-4 text-muted-foreground">Nenhuma publicação ainda.</p>}
      <ul className="mt-4 space-y-3">
        {posts.data?.map((p) => <li key={p.id} className="flex gap-4 rounded-xl bg-card p-5 shadow-sm">
          {p.imageUrls[0] && <img src={p.imageUrls[0]} alt="" className="hidden size-20 shrink-0 rounded-lg object-cover sm:block" />}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><StatusBadge status={p.status} />{p.source} · {new Date(p.created_at).toLocaleDateString("pt-BR")} · {p.imagePaths.length} foto(s)</div>
            <h3 className="mt-1 font-bold">{p.title}</h3>
            {p.summary && <p className="mt-1 line-clamp-2 text-sm">{p.summary}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => void edit(p.id)}>Editar</Button>
              <Button size="sm" variant="outline" onClick={() => void toggle(p.id, p.status)}>{p.status === "published" ? "Despublicar" : "Publicar"}</Button>
              <Button size="sm" variant="destructive" onClick={() => void remove(p.id, p.imagePaths)}>Excluir</Button>
            </div>
          </div>
        </li>)}
      </ul>
    </section>
  </div>;
}
