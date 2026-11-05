import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video-player";
import { supabase } from "@/integrations/supabase/client";
import { adminVideosQuery } from "@/lib/videos-query";
import { removeFiles, signedUrls, uploadFile } from "@/lib/media";
import { checkFile, parseVideoUrl } from "@/lib/video-url";
import { field, StatusBadge, UploadBar, type UploadState } from "./upload-bar";

type Draft = { id?: string; title: string; description: string; mode: "link" | "file"; url: string; filePath: string | null; thumbPath: string | null };
const empty: Draft = { title: "", description: "", mode: "link", url: "", filePath: null, thumbPath: null };

export function VideosAdmin() {
  const qc = useQueryClient();
  const videos = useQuery(adminVideosQuery);
  const [draft, setDraft] = useState<Draft>(empty);
  const [preview, setPreview] = useState<{ file?: string | undefined; thumb?: string | undefined }>({});
  const [uploads, setUploads] = useState<Record<"file" | "thumb", UploadState | undefined>>({ file: undefined, thumb: undefined });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const parsed = draft.mode === "link" && draft.url ? parseVideoUrl(draft.url) : null;
  const uploading = Object.values(uploads).some((u) => u && !u.error);

  function start(slot: "file" | "thumb", file: File) {
    const err = checkFile(file, slot === "file" ? "video" : "image");
    if (err) return setMsg(err);
    setMsg("");
    const local = URL.createObjectURL(file);
    const task = uploadFile("video-media", file, (pct) => setUploads((s) => ({ ...s, [slot]: { ...s[slot]!, pct } })));
    setUploads((s) => ({ ...s, [slot]: { name: file.name, pct: 0, abort: task.abort } }));
    task.promise.then((path) => {
      setPreview((p) => ({ ...p, [slot]: local }));
      setDraft((d) => (slot === "file" ? { ...d, filePath: path } : { ...d, thumbPath: path }));
      setUploads((s) => ({ ...s, [slot]: undefined }));
    }).catch((e: Error) => setUploads((s) => ({ ...s, [slot]: { name: file.name, pct: 0, error: e.message, retry: () => start(slot, file) } })));
  }

  async function edit(id: string) {
    const v = videos.data?.find((x) => x.id === id);
    if (!v) return;
    const urls = await signedUrls("video-media", [v.file_path ?? "", v.thumbnail_path ?? ""]);
    setPreview({ file: v.file_path ? urls[v.file_path] : undefined, thumb: v.thumbnail_path ? urls[v.thumbnail_path] : undefined });
    setUploads({ file: undefined, thumb: undefined }); setMsg("");
    setDraft({ id: v.id, title: v.title, description: v.description, mode: v.kind === "file" ? "file" : "link", url: v.source_url ?? "", filePath: v.file_path, thumbPath: v.thumbnail_path });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(status: "draft" | "published") {
    if (!draft.title.trim()) return setMsg("Informe o título.");
    if (uploading) return setMsg("Aguarde o envio terminar.");
    let media: { kind: string; provider_id: string | null; source_url: string | null; file_path: string | null };
    if (draft.mode === "link") {
      if (!parsed) return setMsg("Link não suportado. Use YouTube, Vimeo ou um link https direto para .mp4/.webm/.ogg.");
      media = { kind: parsed.kind, provider_id: parsed.providerId, source_url: parsed.url, file_path: null };
    } else {
      if (!draft.filePath) return setMsg("Envie o arquivo de vídeo.");
      media = { kind: "file", provider_id: null, source_url: null, file_path: draft.filePath };
    }
    setBusy(true);
    const row = { ...media, title: draft.title.trim(), description: draft.description.trim(), thumbnail_path: draft.thumbPath, status, updated_at: new Date().toISOString() };
    const { data: u } = await supabase.auth.getUser();
    const { error } = draft.id
      ? await supabase.from("videos").update(row).eq("id", draft.id)
      : await supabase.from("videos").insert({ ...row, author_id: u.user?.id ?? null });
    setBusy(false);
    if (error) return setMsg("Não foi possível salvar o vídeo.");
    setMsg(status === "published" ? "Vídeo publicado!" : "Rascunho salvo.");
    setDraft(empty); setPreview({});
    void qc.invalidateQueries({ queryKey: ["videos"] });
  }

  async function toggle(id: string, status: string) {
    const { error } = await supabase.from("videos").update({ status: status === "published" ? "draft" : "published", updated_at: new Date().toISOString() }).eq("id", id);
    if (error) setMsg("Não foi possível alterar o status.");
    void qc.invalidateQueries({ queryKey: ["videos"] });
  }

  async function remove(id: string, files: (string | null)[]) {
    if (!confirm("Excluir este vídeo? Essa ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) return setMsg("Não foi possível excluir.");
    await removeFiles("video-media", files.filter(Boolean) as string[]);
    if (draft.id === id) setDraft(empty);
    void qc.invalidateQueries({ queryKey: ["videos"] });
  }

  return <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
    <form onSubmit={(e) => { e.preventDefault(); void save("published"); }} className="h-fit space-y-4 rounded-xl bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold">{draft.id ? "Editar vídeo" : "Novo vídeo"}</h2>
      <input required className={field} placeholder="Título" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      <textarea rows={3} className={field} placeholder="Descrição" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
      <div className="flex gap-2" role="radiogroup">
        {(["link", "file"] as const).map((m) => <Button key={m} type="button" role="radio" aria-checked={draft.mode === m} variant={draft.mode === m ? "default" : "outline"} size="sm" onClick={() => setDraft({ ...draft, mode: m })}>{m === "link" ? "Por link" : "Enviar arquivo"}</Button>)}
      </div>
      {draft.mode === "link"
        ? <div><input className={field} placeholder="https://www.youtube.com/watch?v=..." value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
            {draft.url && !parsed && <p className="mt-1 text-xs text-destructive">Link não suportado (YouTube, Vimeo ou arquivo .mp4/.webm/.ogg em https).</p>}</div>
        : <div><label className="text-sm font-semibold">Arquivo (MP4, WEBM ou OGG até 50 MB)</label>
            <input type="file" accept="video/mp4,video/webm,video/ogg" className="mt-2 block w-full text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) start("file", f); e.target.value = ""; }} /></div>}
      {uploads.file && <UploadBar u={uploads.file} />}
      <div><label className="text-sm font-semibold">Capa (opcional, imagem até 10 MB)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-sm" onChange={(e) => { const f = e.target.files?.[0]; if (f) start("thumb", f); e.target.value = ""; }} /></div>
      {uploads.thumb && <UploadBar u={uploads.thumb} />}
      {draft.thumbPath && <div className="flex items-center gap-3">{preview.thumb && <img src={preview.thumb} alt="Capa" className="h-16 rounded object-cover" />}<Button type="button" size="sm" variant="ghost" onClick={() => setDraft({ ...draft, thumbPath: null })}>Remover capa</Button></div>}
      {(parsed || (draft.mode === "file" && draft.filePath)) && <div className="overflow-hidden rounded-lg">
        <p className="mb-1 text-xs font-semibold text-muted-foreground">Pré-visualização</p>
        <VideoPlayer kind={draft.mode === "file" ? "file" : parsed!.kind} providerId={parsed?.providerId ?? null} src={draft.mode === "file" ? preview.file ?? null : parsed!.url} poster={preview.thumb} title="Pré-visualização" eager />
      </div>}
      {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
      <div className="flex flex-wrap gap-2">
        <button disabled={busy || uploading} className="flex-1 rounded-lg bg-brand-admin py-3 font-semibold text-brand-white disabled:opacity-60">Publicar</button>
        <Button type="button" variant="outline" className="h-auto" disabled={busy || uploading} onClick={() => void save("draft")}>Salvar rascunho</Button>
        {draft.id && <Button type="button" variant="ghost" className="h-auto" onClick={() => { setDraft(empty); setPreview({}); }}>Cancelar</Button>}
      </div>
    </form>
    <section>
      <h2 className="text-xl font-bold">Vídeos</h2>
      {videos.isLoading && <p className="mt-4 text-muted-foreground">Carregando…</p>}
      {videos.isError && <p className="mt-4 text-destructive">Não foi possível carregar os vídeos.</p>}
      {videos.data?.length === 0 && <p className="mt-4 text-muted-foreground">Nenhum vídeo ainda.</p>}
      <ul className="mt-4 space-y-3">
        {videos.data?.map((v) => <li key={v.id} className="rounded-xl bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><StatusBadge status={v.status} />{v.kind === "file" ? "Arquivo enviado" : v.kind} · {new Date(v.created_at).toLocaleDateString("pt-BR")}</div>
          <h3 className="mt-1 font-bold">{v.title}</h3>
          {v.description && <p className="mt-1 line-clamp-2 text-sm">{v.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => void edit(v.id)}>Editar</Button>
            <Button size="sm" variant="outline" onClick={() => void toggle(v.id, v.status)}>{v.status === "published" ? "Despublicar" : "Publicar"}</Button>
            <Button size="sm" variant="destructive" onClick={() => void remove(v.id, [v.file_path, v.thumbnail_path])}>Excluir</Button>
          </div>
        </li>)}
      </ul>
    </section>
  </div>;
}
