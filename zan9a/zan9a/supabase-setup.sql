-- ============================================================
--  zan9a — Supabase setup
--  Paste ALL of this into Supabase -> SQL Editor -> New query -> Run.
--  It is safe to run more than once.
-- ============================================================

-- 1) PRODUCTS TABLE -----------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric not null default 0,
  old_price   numeric,
  category    text default 'tops',
  sizes       text[] default '{}',
  stock       integer default 0,
  image_url   text,
  is_drop     boolean default false,
  featured    boolean default false,
  created_at  timestamptz default now()
);

-- 2) SETTINGS TABLE (single row, id = 1) --------------------
create table if not exists public.settings (
  id                  integer primary key,
  announcement_text   text,
  announcement_active boolean default true,
  hero_title          text,
  hero_subtitle       text,
  drop_title          text,
  drop_ends_at        timestamptz,
  currency            text default 'DT',
  whatsapp_number     text,
  instagram           text
);

-- seed the one settings row (only inserts if it isn't there yet)
insert into public.settings (id, announcement_text, announcement_active, hero_title,
  hero_subtitle, drop_title, drop_ends_at, currency, whatsapp_number, instagram)
values (
  1,
  'NEW DROP LIVE NOW · FREE DELIVERY OVER 200 DT · TUNIS / SOUSSE / SFAX',
  true,
  'THE STREET',
  'zan9a means the street. Limited streetwear drops that go live and die in one hour. Blink and the block moves on without you.',
  'ONE-HOUR DROP',
  now() + interval '1 hour',
  'DT',
  '21600000000',
  'zan9a.tn'
)
on conflict (id) do nothing;

-- 3) ROW LEVEL SECURITY -------------------------------------
alter table public.products enable row level security;
alter table public.settings enable row level security;

-- Everyone (visitors) can READ products and settings
drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select using (true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings
  for select using (true);

-- Only logged-in users (the owner) can WRITE
drop policy if exists "auth write products" on public.products;
create policy "auth write products" on public.products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "auth write settings" on public.settings;
create policy "auth write settings" on public.settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 4) STORAGE BUCKET for product photos ----------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone can view images; only logged-in owner can upload/replace/delete
drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "auth upload images" on storage.objects;
create policy "auth upload images" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "auth update images" on storage.objects;
create policy "auth update images" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "auth delete images" on storage.objects;
create policy "auth delete images" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ============================================================
--  Done. Next: create your owner account in Authentication -> Users.
-- ============================================================
