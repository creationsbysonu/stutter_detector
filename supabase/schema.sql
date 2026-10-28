-- Run this in your Supabase project's SQL editor

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  language text not null check (language in ('english', 'hindi', 'nepali')),
  passage_id text,
  label text not null,
  fluent boolean not null,
  confidence double precision,
  chunk_seconds double precision default 1.5,
  audio_url text
);

create index if not exists idx_sessions_created_at on public.sessions (created_at desc);
create index if not exists idx_sessions_language on public.sessions (language);
create index if not exists idx_sessions_fluent on public.sessions (fluent);

alter table public.sessions enable row level security;

create policy "Public insert access"
  on public.sessions for insert
  with check (true);

create policy "Public read access"
  on public.sessions for select
  using (true);
