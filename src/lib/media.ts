import { supabase } from "@/integrations/supabase/client";

export type Bucket = "blog-media" | "video-media";

/** Private buckets: files are read through short-lived signed links. */
export async function signedUrls(bucket: Bucket, paths: string[]) {
  const map: Record<string, string> = {};
  const list = [...new Set(paths.filter(Boolean))];
  if (!list.length) return map;
  const { data } = await supabase.storage.from(bucket).createSignedUrls(list, 60 * 60 * 6);
  data?.forEach((d) => { if (d.path && d.signedUrl) map[d.path] = d.signedUrl; });
  return map;
}

export type UploadTask = { promise: Promise<string>; abort: () => void };

/** Real upload with progress and cancel, straight to storage. */
export function uploadFile(bucket: Bucket, file: File, onProgress: (pct: number) => void): UploadTask {
  const xhr = new XMLHttpRequest();
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const promise = (async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Sessão expirada. Entre novamente.");
    return new Promise<string>((resolve, reject) => {
      xhr.open("POST", `${import.meta.env["VITE_SUPABASE_URL"]}/storage/v1/object/${bucket}/${path}`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("apikey", import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.setRequestHeader("x-upsert", "false");
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve(path) : reject(new Error(xhr.status === 413 ? "Arquivo grande demais." : "Falha no envio do arquivo.")));
      xhr.onerror = () => reject(new Error("Falha de conexão no envio."));
      xhr.onabort = () => reject(new Error("Envio cancelado."));
      xhr.send(file);
    });
  })();
  return { promise, abort: () => xhr.abort() };
}

export async function removeFiles(bucket: Bucket, paths: string[]) {
  const list = paths.filter(Boolean);
  if (list.length) await supabase.storage.from(bucket).remove(list);
}
