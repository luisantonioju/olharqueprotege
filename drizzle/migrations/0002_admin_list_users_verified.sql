CREATE OR REPLACE FUNCTION public.admin_list_users_v2(_search text, _offset int, _limit int)
RETURNS TABLE(id uuid, full_name text, email text, created_at timestamptz, verified boolean, total bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY
  WITH f AS (
    SELECT p.id, p.full_name, p.email, p.created_at, (u.email_confirmed_at IS NOT NULL) AS verified
    FROM public.profiles p JOIN auth.users u ON u.id = p.id
    WHERE NOT public.has_role(p.id, 'admin')
      AND (coalesce(_search, '') = '' OR p.full_name ILIKE '%' || _search || '%' OR p.email ILIKE '%' || _search || '%')
  )
  SELECT f.id, f.full_name, f.email, f.created_at, f.verified, (SELECT count(*) FROM f)
  FROM f ORDER BY f.created_at DESC OFFSET greatest(_offset, 0) LIMIT least(greatest(_limit, 1), 100);
END $$;
REVOKE EXECUTE ON FUNCTION public.admin_list_users_v2(text, int, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users_v2(text, int, int) TO authenticated;