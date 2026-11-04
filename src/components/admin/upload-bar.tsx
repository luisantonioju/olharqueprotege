import { Button } from "@/components/ui/button";

export const field = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring";

export type UploadState = { name: string; pct: number; error?: string; abort?: () => void; retry?: () => void };

export function UploadBar({ u }: { u: UploadState }) {
  return <div className="rounded-lg border border-input p-3 text-xs">
    <div className="flex items-center justify-between gap-2"><span className="truncate">{u.name}</span><span>{u.error ? "" : `${u.pct}%`}</span></div>
    {!u.error && <div className="mt-2 h-1.5 overflow-hidden rounded bg-muted"><div className="h-full bg-brand-admin transition-all" style={{ width: `${u.pct}%` }} /></div>}
    {u.error && <p className="mt-1 text-destructive">{u.error}</p>}
    <div className="mt-2 flex gap-2">
      {u.abort && !u.error && u.pct < 100 && <Button type="button" size="sm" variant="outline" onClick={u.abort}>Cancelar</Button>}
      {u.error && u.retry && <Button type="button" size="sm" variant="outline" onClick={u.retry}>Tentar de novo</Button>}
    </div>
  </div>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status === "published" ? "bg-brand-admin text-brand-white" : "bg-muted text-muted-foreground"}`}>{status === "published" ? "Publicado" : "Rascunho"}</span>;
}
