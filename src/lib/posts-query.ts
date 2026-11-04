import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/media";

export const imagesOf = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

async function load(publishedOnly: boolean) {
  let q = supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (publishedOnly) q = q.eq("status", "published");
  const { data, error } = await q;
  if (error) throw error;
  const urls = await signedUrls("blog-media", data.flatMap((p) => imagesOf(p.images)));
  return data.map((p) => ({ ...p, imagePaths: imagesOf(p.images), imageUrls: imagesOf(p.images).map((x) => urls[x]).filter(Boolean) as string[] }));
}

export const postsQuery = queryOptions({ queryKey: ["posts", "public"], queryFn: () => load(true) });
export const adminPostsQuery = queryOptions({ queryKey: ["posts", "admin"], queryFn: () => load(false) });
