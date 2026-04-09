create extension if not exists pgcrypto;

create table if not exists public.settings (
  id text primary key,
  site_name text not null,
  logo_text text not null,
  whatsapp text not null,
  primary_color text not null,
  secondary_color text not null,
  hero_title text not null,
  hero_subtitle text not null,
  about_text text not null,
  address text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  type text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null,
  price integer not null,
  image text not null,
  active boolean not null default true,
  featured boolean not null default true,
  badge text,
  calories integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.banner (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null,
  button_text text not null,
  button_href text not null,
  image text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  content text not null,
  rating integer not null default 5,
  avatar text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null unique,
  email text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_id uuid not null references public.customers(id) on delete cascade,
  customer_name text not null,
  whatsapp text not null,
  email text,
  address text,
  delivery_date text not null,
  delivery_time text not null,
  note text,
  delivery_method text not null,
  status text not null default 'PENDING',
  total integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu(id) on delete set null,
  menu_name text not null,
  price integer not null,
  quantity integer not null,
  note text,
  subtotal integer not null,
  image text,
  created_at timestamptz not null default now()
);

alter table public.settings enable row level security;
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.menu enable row level security;
alter table public.banner enable row level security;
alter table public.testimonials enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings for select using (true);
drop policy if exists "public write settings" on public.settings;
create policy "public write settings" on public.settings for all using (true) with check (true);

drop policy if exists "public read admins" on public.admins;
create policy "public read admins" on public.admins for select using (true);
drop policy if exists "public write admins" on public.admins;
create policy "public write admins" on public.admins for all using (true) with check (true);

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "public write categories" on public.categories;
create policy "public write categories" on public.categories for all using (true) with check (true);

drop policy if exists "public read menu" on public.menu;
create policy "public read menu" on public.menu for select using (true);
drop policy if exists "public write menu" on public.menu;
create policy "public write menu" on public.menu for all using (true) with check (true);

drop policy if exists "public read banner" on public.banner;
create policy "public read banner" on public.banner for select using (true);
drop policy if exists "public write banner" on public.banner;
create policy "public write banner" on public.banner for all using (true) with check (true);

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials for select using (true);
drop policy if exists "public write testimonials" on public.testimonials;
create policy "public write testimonials" on public.testimonials for all using (true) with check (true);

drop policy if exists "public read customers" on public.customers;
create policy "public read customers" on public.customers for select using (true);
drop policy if exists "public write customers" on public.customers;
create policy "public write customers" on public.customers for all using (true) with check (true);

drop policy if exists "public read orders" on public.orders;
create policy "public read orders" on public.orders for select using (true);
drop policy if exists "public write orders" on public.orders;
create policy "public write orders" on public.orders for all using (true) with check (true);

drop policy if exists "public read order_items" on public.order_items;
create policy "public read order_items" on public.order_items for select using (true);
drop policy if exists "public write order_items" on public.order_items;
create policy "public write order_items" on public.order_items for all using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read storage" on storage.objects;
create policy "public read storage"
on storage.objects for select
using (bucket_id = 'menu-images');

drop policy if exists "public upload storage" on storage.objects;
create policy "public upload storage"
on storage.objects for insert
with check (bucket_id = 'menu-images');

drop policy if exists "public update storage" on storage.objects;
create policy "public update storage"
on storage.objects for update
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "public delete storage" on storage.objects;
create policy "public delete storage"
on storage.objects for delete
using (bucket_id = 'menu-images');

insert into public.settings (
  id, site_name, logo_text, whatsapp, primary_color, secondary_color,
  hero_title, hero_subtitle, about_text, address, email
)
values (
  'main',
  'Catring Healthy Catering',
  'CATRING',
  '6281234567890',
  '#E8F5E9',
  '#2E7D32',
  'Healthy Catering for Your Daily Needs',
  'Makanan sehat, higienis, dan lezat untuk rumah, kantor, dan acara spesial.',
  'Kami menyajikan catering sehat dengan bahan segar, plating premium, dan proses higienis untuk rutinitas harian hingga event besar.',
  'Jl. Sehat Organik No. 27, Jakarta',
  'hello@catring.id'
)
on conflict (id) do nothing;

insert into public.admins (name, email, password_hash)
values (
  'Admin Catring',
  'admin@catring.local',
  '$2b$10$/0BneWxs1crdXHHJvYvepelEXTQDjyae41xpLliTweEzKE3ek4Me.'
)
on conflict (email) do nothing;

insert into public.categories (name, slug, description, image, type, sort_order)
values
  ('Catering Harian', 'catering-harian', 'Paket makan harian sehat untuk kebutuhan rutin.', '/images/category-harian.svg', 'daily', 1),
  ('Event & Kantor', 'event-kantor', 'Catering premium untuk meeting, seminar, dan corporate event.', '/images/category-event.svg', 'event', 2)
on conflict (slug) do nothing;

insert into public.menu (category_id, name, slug, description, price, image, badge, calories, featured, sort_order)
select c.id, 'Green Power Bowl', 'green-power-bowl', 'Nasi merah, grilled chicken, broccoli, edamame, dan lemon dressing.', 48000, '/images/menu-green-bowl.svg', 'Best Seller', 420, true, 1
from public.categories c
where c.slug = 'catering-harian'
on conflict (slug) do nothing;

insert into public.menu (category_id, name, slug, description, price, image, badge, calories, featured, sort_order)
select c.id, 'Salmon Herb Box', 'salmon-herb-box', 'Salmon panggang, mashed potato, baby carrot, dan sauteed beans.', 65000, '/images/menu-salmon-box.svg', 'Premium', 510, true, 2
from public.categories c
where c.slug = 'catering-harian'
on conflict (slug) do nothing;

insert into public.menu (category_id, name, slug, description, price, image, badge, calories, featured, sort_order)
select c.id, 'Office Lunch Set', 'office-lunch-set', 'Menu lengkap untuk kantor dengan protein, sayur, buah, dan dessert ringan.', 55000, '/images/menu-office-set.svg', 'Corporate', 460, true, 3
from public.categories c
where c.slug = 'event-kantor'
on conflict (slug) do nothing;

insert into public.menu (category_id, name, slug, description, price, image, badge, calories, featured, sort_order)
select c.id, 'Harvest Snack Box', 'harvest-snack-box', 'Box snack modern berisi sandwich, salad cup, granola bite, dan jus segar.', 35000, '/images/menu-snack-box.svg', 'Healthy Box', 260, true, 4
from public.categories c
where c.slug = 'event-kantor'
on conflict (slug) do nothing;

insert into public.banner (title, subtitle, button_text, button_href, image, active)
values (
  'Organic Catering for Teams & Families',
  'Kurasi menu sehat dengan presentasi modern dan pengiriman tepat waktu.',
  'Konsultasi Menu',
  '#kontak',
  '/images/banner-organic.svg',
  true
)
on conflict do nothing;

insert into public.testimonials (name, role, content, rating, active)
values
  ('Nadine Putri', 'HR Manager', 'Setup catering kantor jadi jauh lebih praktis. Presentasinya premium dan selalu datang on time.', 5, true),
  ('Raka Pratama', 'Fitness Coach', 'Porsinya pas, rasanya enak, dan cocok banget buat pola makan sehat harian.', 5, true),
  ('Dewi Amelia', 'Event Organizer', 'Untuk event klien, visual makanannya rapi banget dan tamu suka sama menu sehatnya.', 5, true)
on conflict do nothing;
