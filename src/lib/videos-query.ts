import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/media";

async function load(publishedOnly: boolean) {
  let q = supabase.from("videos").select("*").order("created_at", { ascending: false });
  if (publishedOnly) q = q.eq("status", "published");
  const { data, error } = await q;
  if (error) throw error;
  const urls = await signedUrls("video-media", data.flatMap((v) => [v.file_path ?? "", v.thumbnail_path ?? ""]));
  return data.map((v) => ({ ...v, fileUrl: v.file_path ? urls[v.file_path] ?? null : null, thumbUrl: v.thumbnail_path ? urls[v.thumbnail_path] ?? null : null }));
}

export type VideoRow = Awaited<ReturnType<typeof load>>[number];
export const videosQuery = queryOptions({ queryKey: ["videos", "public"], queryFn: () => load(true) });
export const adminVideosQuery = queryOptions({ queryKey: ["videos", "admin"], queryFn: () => load(false) });
