create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  link text,
  source text not null default 'Olhar Que Protege',
  author_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "Anyone reads posts" on public.posts for select to anon, authenticated using (true);
create policy "Admins insert posts" on public.posts for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update posts" on public.posts for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete posts" on public.posts for delete to authenticated using (public.has_role(auth.uid(), 'admin'));