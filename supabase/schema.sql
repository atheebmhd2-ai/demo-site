-- Run in the Supabase SQL editor before connecting Grind.
-- Safe to re-run: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS throughout.
create extension if not exists pgcrypto;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(), name text not null, description text not null default '',
  category text not null default 'Coffee', price integer not null default 0,
  image_url text not null default '', image_alt text not null default '',
  featured boolean not null default false,
  available boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.menu_items add column if not exists image_alt text not null default '';

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(), quote text not null, name text not null,
  role text not null default 'Local guest', image_url text not null default '', image_alt text not null default '',
  featured boolean not null default true, sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.testimonials add column if not exists image_alt text not null default '';

create table if not exists public.business_info (
  id text primary key default 'main', name text not null default 'Grind', tagline text not null default '',
  story text not null default '', address text not null default '', city text not null default '',
  hours_weekday text not null default '', hours_weekend text not null default '', phone text not null default '',
  email text not null default '', instagram text not null default '', hero_image_url text not null default '',
  hero_image_alt text not null default '', story_image_url text not null default '', story_image_alt text not null default '',
  announcement text not null default ''
);
alter table public.business_info add column if not exists hero_image_alt text not null default '';
alter table public.business_info add column if not exists story_image_alt text not null default '';

-- One row per public page: home, menu, story, gallery, contact.
create table if not exists public.seo_settings (
  page_key text primary key,
  seo_title text not null default '',
  meta_description text not null default '',
  h1 text not null default ''
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.business_info enable row level security;
alter table public.seo_settings enable row level security;
alter table public.gallery_images enable row level security;
-- Content is accessed by server-side service role only. Never expose the service key in the browser.
insert into storage.buckets (id, name, public) values ('grind-media', 'grind-media', true) on conflict (id) do update set public = true;
create policy "Public can view Grind media" on storage.objects for select to public using (bucket_id = 'grind-media');
