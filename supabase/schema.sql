-- ============================================================
-- JCROWN DIGITALS — Supabase Schema
-- Run this in: Supabase Dashboard -> SQL Editor
-- Grounded in SPEC.md section 6 (Data Model + Security)
-- ============================================================

-- ------------------------------------------------------------
-- books: publications managed from the admin portal
-- ------------------------------------------------------------
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  author text not null default 'Jediah Akeredolu',
  cover_image text,
  file_path text,
  file_format text not null default 'PDF',
  price real not null default 0,
  is_free boolean not null default false,
  is_published boolean not null default false,
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
  before update on public.books
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- subscribers: newsletter signups
-- ------------------------------------------------------------
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ------------------------------------------------------------
-- contacts: contact-form messages
-- ------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- site_content: editable homepage copy (about bio, hero, etc.)
-- key: 'about' | 'hero' | 'offers' | 'footer'
-- ------------------------------------------------------------
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  skey text unique not null,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
-- IMPORTANT: The admin portal is a client-side SPA that talks to Supabase
-- with the ANON key (no server). To let the admin edit everything (books,
-- site content, subscribers, messages) we intentionally open all tables to
-- the anon role. The public UI hides these write paths, and the books grid
-- filters is_published = true in the app.
--
-- SECURITY NOTE: This is fine for a personal/staging site. If this ever goes
-- fully public, harden it by moving admin writes behind a Supabase Edge
-- Function using the service_role key (or real Supabase Auth), then restrict
-- the policies below to `authenticated`/service_role only.
-- ------------------------------------------------------------
alter table public.books enable row level security;
alter table public.subscribers enable row level security;
alter table public.contacts enable row level security;
alter table public.site_content enable row level security;

-- books: full anon access so the admin portal can manage books
drop policy if exists "books_all_anon" on public.books;
create policy "books_all_anon"
  on public.books for all
  to anon, authenticated
  using (true)
  with check (true);

-- subscribers: full anon access
drop policy if exists "subscribers_all_anon" on public.subscribers;
create policy "subscribers_all_anon"
  on public.subscribers for all
  to anon, authenticated
  using (true)
  with check (true);

-- contacts: full anon access
drop policy if exists "contacts_all_anon" on public.contacts;
create policy "contacts_all_anon"
  on public.contacts for all
  to anon, authenticated
  using (true)
  with check (true);

-- site_content: full anon access (this is the "edit everything" table)
drop policy if exists "site_content_all_anon" on public.site_content;
create policy "site_content_all_anon"
  on public.site_content for all
  to anon, authenticated
  using (true)
  with check (true);

-- ------------------------------------------------------------
-- Seed editable content rows (SQL Editor will upsert these)
-- Update the JSON here to change the site's copy.
-- ------------------------------------------------------------
insert into public.site_content (skey, content) values
  ('about', '{"title":"Meet Jediah Akeredolu","bio0":"Jediah Akeredolu is the person behind JCROWN DIGITALS, a digital platform created to share ideas, publications, and valuable resources with readers.","bio1":"Through his work, he aims to make knowledge easier to access and give people an opportunity to discover useful perspectives through digital content.","bio2":"Whether you are visiting to discover a book, explore a free resource, or learn more about his work, JCROWN DIGITALS is designed to make that experience simple, welcoming, and accessible."}')
on conflict (skey) do nothing;
