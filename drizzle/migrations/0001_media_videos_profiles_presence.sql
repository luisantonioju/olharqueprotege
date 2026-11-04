-- Blog posts: richer content, photos and draft/published state
ALTER TABLE public.posts ADD COLUMN content text NOT NULL DEFAULT '';
ALTER TABLE public.posts ADD COLUMN caption text NOT NULL DEFAULT '';
ALTER TABLE public.posts ADD COLUMN images jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.posts ADD COLUMN status text NOT NULL DEFAULT 'published';
ALTER TABLE public.posts ADD CONSTRAINT posts_status_check CHECK (status IN ('draft','published'));
CREATE INDEX posts_status_created_idx ON public.posts (status, created_at DESC);

DROP POLICY "Anyone reads posts" ON public.posts;
CREATE POLICY "Anyone reads published posts" ON public.posts FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

-- Videos
CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL CHECK (kind IN ('youtube','vimeo','file','direct')),
  provider_id text,
  source_url text,
  file_path text,
  thumbnail_path text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE INDEX videos_status_created_idx ON public.videos (status, created_at DESC);
CREATE POLICY "Anyone reads published videos" ON public.videos FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert videos" ON public.videos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update videos" ON public.videos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete videos" ON public.videos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.videos (title, description, kind, provider_id, source_url, status, created_at) VALUES
 ('ECA Digital: lei que protege crianças na internet entra em vigor','Especialista comenta a nova lei de proteção digital — Jovem Pan News.','youtube','8vlPYxH0pFU','https://www.youtube.com/watch?v=8vlPYxH0pFU','published', now()),
 ('Proteção de crianças e adolescentes no ambiente digital','Decisões do Superior Tribunal de Justiça (STJ) sobre o tema.','youtube','nuunM_2ZhEs','https://www.youtube.com/watch?v=nuunM_2ZhEs','published', now() - interval '1 minute'),
 ('Como controlar o celular do seu filho com o Google Family Link','Dicas práticas de configuração — Admirável Mundo Incrível.','youtube','gRxnqOVsqfo','https://www.youtube.com/watch?v=gRxnqOVsqfo','published', now() - interval '2 minutes');

-- Profiles for common users (no passwords ever stored here)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, updated_at) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE INDEX profiles_created_idx ON public.profiles (created_at DESC);
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, created_at)
  VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'full_name', ''), 200), coalesce(NEW.email, ''), coalesce(NEW.created_at, now()))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_user_email_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.profiles SET email = coalesce(NEW.email, ''), updated_at = now() WHERE id = NEW.id;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_email_changed AFTER UPDATE OF email ON auth.users FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email) EXECUTE FUNCTION public.handle_user_email_change();

INSERT INTO public.profiles (id, full_name, email, created_at)
SELECT u.id, left(coalesce(u.raw_user_meta_data->>'full_name', ''), 200), coalesce(u.email, ''), u.created_at FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- Presence heartbeat for common users
CREATE TABLE public.user_presence (
  user_id uuid PRIMARY KEY,
  last_seen timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_presence TO authenticated;
GRANT ALL ON public.user_presence TO service_role;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own presence" ON public.user_presence FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND NOT public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_presence() RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.user_presence (user_id, last_seen)
  SELECT auth.uid(), now() WHERE auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin')
  ON CONFLICT (user_id) DO UPDATE SET last_seen = now();
$$;
REVOKE EXECUTE ON FUNCTION public.touch_presence() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.touch_presence() TO authenticated;

-- Admin-only stats and paginated user list (excludes team accounts)
CREATE OR REPLACE FUNCTION public.admin_user_stats() RETURNS TABLE(total bigint, online bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY SELECT
    (SELECT count(*) FROM public.profiles p WHERE NOT public.has_role(p.id, 'admin')),
    (SELECT count(*) FROM public.user_presence up WHERE up.last_seen > now() - interval '90 seconds' AND NOT public.has_role(up.user_id, 'admin'));
END $$;
REVOKE EXECUTE ON FUNCTION public.admin_user_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_user_stats() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_list_users(_search text, _offset int, _limit int)
RETURNS TABLE(id uuid, full_name text, email text, created_at timestamptz, total bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH f AS (
    SELECT p.id, p.full_name, p.email, p.created_at FROM public.profiles p
    WHERE NOT public.has_role(p.id, 'admin')
      AND (coalesce(_search, '') = '' OR p.full_name ILIKE '%' || _search || '%' OR p.email ILIKE '%' || _search || '%')
  )
  SELECT f.id, f.full_name, f.email, f.created_at, (SELECT count(*) FROM f)
  FROM f ORDER BY f.created_at DESC OFFSET greatest(_offset, 0) LIMIT least(greatest(_limit, 1), 100);
END $$;
REVOKE EXECUTE ON FUNCTION public.admin_list_users(text, int, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, int, int) TO authenticated;

-- Storage: admins write; anyone reads only files of published content
CREATE POLICY "Admins write media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('blog-media','video-media') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('blog-media','video-media') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('blog-media','video-media') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Read media" ON storage.objects FOR SELECT TO anon, authenticated USING (
  (bucket_id IN ('blog-media','video-media') AND public.has_role(auth.uid(), 'admin'))
  OR (bucket_id = 'blog-media' AND EXISTS (SELECT 1 FROM public.posts p WHERE p.status = 'published' AND p.images ? name))
  OR (bucket_id = 'video-media' AND EXISTS (SELECT 1 FROM public.videos v WHERE v.status = 'published' AND (v.file_path = name OR v.thumbnail_path = name)))
);