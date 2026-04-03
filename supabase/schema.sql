-- Portfolio: tables id + data (jsonb). Exécuter dans Supabase → SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_works (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.content_works enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.settings enable row level security;
alter table public.messages enable row level security;

create policy "projects_select_anon" on public.projects for select using (true);
create policy "content_works_select_anon" on public.content_works for select using (true);
create policy "experiences_select_anon" on public.experiences for select using (true);
create policy "education_select_anon" on public.education for select using (true);
create policy "skills_select_anon" on public.skills for select using (true);
create policy "settings_select_anon" on public.settings for select using (true);

create policy "projects_write_auth" on public.projects for insert with check (auth.uid() is not null);
create policy "projects_update_auth" on public.projects for update using (auth.uid() is not null);
create policy "projects_delete_auth" on public.projects for delete using (auth.uid() is not null);

create policy "content_works_write_auth" on public.content_works for insert with check (auth.uid() is not null);
create policy "content_works_update_auth" on public.content_works for update using (auth.uid() is not null);
create policy "content_works_delete_auth" on public.content_works for delete using (auth.uid() is not null);

create policy "experiences_write_auth" on public.experiences for insert with check (auth.uid() is not null);
create policy "experiences_update_auth" on public.experiences for update using (auth.uid() is not null);
create policy "experiences_delete_auth" on public.experiences for delete using (auth.uid() is not null);

create policy "education_write_auth" on public.education for insert with check (auth.uid() is not null);
create policy "education_update_auth" on public.education for update using (auth.uid() is not null);
create policy "education_delete_auth" on public.education for delete using (auth.uid() is not null);

create policy "skills_write_auth" on public.skills for insert with check (auth.uid() is not null);
create policy "skills_update_auth" on public.skills for update using (auth.uid() is not null);
create policy "skills_delete_auth" on public.skills for delete using (auth.uid() is not null);

create policy "settings_write_auth" on public.settings for insert with check (auth.uid() is not null);
create policy "settings_update_auth" on public.settings for update using (auth.uid() is not null);
create policy "settings_delete_auth" on public.settings for delete using (auth.uid() is not null);

create policy "messages_insert_anon" on public.messages for insert with check (true);
create policy "messages_select_auth" on public.messages for select using (auth.uid() is not null);
create policy "messages_update_auth" on public.messages for update using (auth.uid() is not null);
create policy "messages_delete_auth" on public.messages for delete using (auth.uid() is not null);
