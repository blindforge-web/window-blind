create extension if not exists pgcrypto;

drop table if exists public.orders cascade;
drop table if exists public.gallery_items cascade;
drop table if exists public.clients cascade;
drop table if exists public.team_members cascade;
drop table if exists public.services cascade;
drop table if exists public.site_highlights cascade;
drop table if exists public.site_sections cascade;
drop table if exists public.social_links cascade;
drop table if exists public.navbar cascade;
drop table if exists public.contact_info cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.delivery_states cascade;
drop table if exists public.product_media cascade;
drop table if exists public.products cascade;
drop table if exists public.admin_profiles cascade;

create table public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id text primary key default 'default',
  brand_name text not null,
  short_name text not null,
  tagline text not null default '',
  logo_url text,
  footer_note text not null default '',
  bank_name text not null default '',
  account_name text not null default '',
  account_number text not null default '',
  payment_note text not null default '',
  primary_color text not null default '#0A2540',
  secondary_color text not null default '#D4AF37',
  accent_color text not null default '#F5F5F5',
  page_color text not null default '#F5F7FA',
  surface_color text not null default '#FFFFFF',
  ink_color text not null default '#0F172A',
  muted_color text not null default '#475569',
  line_color text not null default 'rgba(10, 37, 64, 0.12)',
  created_at timestamptz not null default now()
);

create table public.contact_info (
  id text primary key default 'default',
  phone_1 text not null default '',
  phone_2 text,
  whatsapp_number text not null default '',
  email text,
  address text not null default '',
  created_at timestamptz not null default now()
);

create table public.navbar (
  id text primary key,
  title text not null,
  link text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.social_links (
  id text primary key,
  platform text not null,
  url text not null,
  display_name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.site_sections (
  section_key text primary key,
  eyebrow text,
  title text not null,
  subtitle text,
  body text,
  primary_cta_label text,
  primary_cta_link text,
  secondary_cta_label text,
  secondary_cta_link text,
  media_url text,
  media_kind text not null default 'image' check (media_kind in ('image', 'video')),
  media_alt text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.site_highlights (
  id text primary key,
  title text not null,
  description text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id text primary key,
  title text not null,
  description text not null,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  collection text not null,
  short_description text not null,
  description text not null,
  image_url text,
  base_price integer not null,
  sale_price integer,
  lead_time text not null,
  rating numeric(2, 1) not null default 5.0,
  review_count integer not null default 0,
  badge text,
  is_listed boolean not null default true,
  measurements text[] not null default '{}',
  colors text[] not null default '{}',
  features text[] not null default '{}',
  ideal_for text[] not null default '{}',
  visual_from text not null default '#d7e3f1',
  visual_to text not null default '#0A2540',
  visual_accent text not null default '#D4AF37',
  visual_label text not null default 'Blind',
  created_at timestamptz not null default now()
);

create table public.product_media (
  id text primary key,
  product_id uuid not null references public.products (id) on delete cascade,
  title text,
  media_url text not null,
  media_kind text not null default 'image' check (media_kind in ('image', 'video')),
  alt_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_detail boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_media_product_id_idx on public.product_media (product_id, sort_order);

create table public.delivery_states (
  code text primary key,
  name text not null unique,
  is_active boolean not null default false,
  eta text not null default '3 to 6 working days',
  created_at timestamptz not null default now()
);

create table public.team_members (
  id text primary key,
  name text not null,
  role text not null,
  bio text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.clients (
  id text primary key,
  name text not null,
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.gallery_items (
  id text primary key,
  title text not null,
  description text,
  media_url text,
  media_kind text not null default 'image' check (media_kind in ('image', 'video')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  product_id uuid references public.products (id) on delete set null,
  product_slug text not null,
  product_name text not null,
  total_amount integer not null,
  quantity integer not null default 1,
  delivery_state text not null,
  delivery_address text not null,
  width text not null,
  height text not null,
  selected_color text not null,
  mount_type text not null,
  control_side text not null,
  notes text,
  payment_proof_path text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'paid_delivered')),
  created_at timestamptz not null default now()
);

create index orders_customer_user_id_idx on public.orders (customer_user_id);
create index orders_status_idx on public.orders (status);

create or replace function public.is_active_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid() and is_active = true
  );
$$;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_info enable row level security;
alter table public.navbar enable row level security;
alter table public.social_links enable row level security;
alter table public.site_sections enable row level security;
alter table public.site_highlights enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.delivery_states enable row level security;
alter table public.team_members enable row level security;
alter table public.clients enable row level security;
alter table public.gallery_items enable row level security;
alter table public.orders enable row level security;

drop policy if exists "admins can read own profile" on public.admin_profiles;
create policy "admins can read own profile"
on public.admin_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings"
on public.site_settings
for select
using (true);

drop policy if exists "public can read contact info" on public.contact_info;
create policy "public can read contact info"
on public.contact_info
for select
using (true);

drop policy if exists "public can read navbar" on public.navbar;
create policy "public can read navbar"
on public.navbar
for select
using (true);

drop policy if exists "public can read social links" on public.social_links;
create policy "public can read social links"
on public.social_links
for select
using (true);

drop policy if exists "public can read site sections" on public.site_sections;
create policy "public can read site sections"
on public.site_sections
for select
using (true);

drop policy if exists "public can read site highlights" on public.site_highlights;
create policy "public can read site highlights"
on public.site_highlights
for select
using (true);

drop policy if exists "public can read services" on public.services;
create policy "public can read services"
on public.services
for select
using (true);

drop policy if exists "public can read listed products" on public.products;
create policy "public can read listed products"
on public.products
for select
using (is_listed = true);

drop policy if exists "public can read product media" on public.product_media;
create policy "public can read product media"
on public.product_media
for select
using (true);

drop policy if exists "public can read delivery states" on public.delivery_states;
create policy "public can read delivery states"
on public.delivery_states
for select
using (true);

drop policy if exists "public can read team members" on public.team_members;
create policy "public can read team members"
on public.team_members
for select
using (true);

drop policy if exists "public can read clients" on public.clients;
create policy "public can read clients"
on public.clients
for select
using (true);

drop policy if exists "public can read gallery items" on public.gallery_items;
create policy "public can read gallery items"
on public.gallery_items
for select
using (true);

drop policy if exists "customers read own orders" on public.orders;
create policy "customers read own orders"
on public.orders
for select
to authenticated
using (customer_user_id = auth.uid());

drop policy if exists "admins manage site settings" on public.site_settings;
create policy "admins manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage contact info" on public.contact_info;
create policy "admins manage contact info"
on public.contact_info
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage navbar" on public.navbar;
create policy "admins manage navbar"
on public.navbar
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage social links" on public.social_links;
create policy "admins manage social links"
on public.social_links
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage site sections" on public.site_sections;
create policy "admins manage site sections"
on public.site_sections
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage site highlights" on public.site_highlights;
create policy "admins manage site highlights"
on public.site_highlights
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage services" on public.services;
create policy "admins manage services"
on public.services
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products"
on public.products
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage product media" on public.product_media;
create policy "admins manage product media"
on public.product_media
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage delivery states" on public.delivery_states;
create policy "admins manage delivery states"
on public.delivery_states
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage team members" on public.team_members;
create policy "admins manage team members"
on public.team_members
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage clients" on public.clients;
create policy "admins manage clients"
on public.clients
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins manage gallery items" on public.gallery_items;
create policy "admins manage gallery items"
on public.gallery_items
for all
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders"
on public.orders
for select
to authenticated
using (public.is_active_admin());

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders"
on public.orders
for update
to authenticated
using (public.is_active_admin())
with check (public.is_active_admin());

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update
set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "public can read site media" on storage.objects;
create policy "public can read site media"
on storage.objects
for select
using (bucket_id = 'site-media');

drop policy if exists "admins manage site media" on storage.objects;
create policy "admins manage site media"
on storage.objects
for all
to authenticated
using (bucket_id = 'site-media' and public.is_active_admin())
with check (bucket_id = 'site-media' and public.is_active_admin());

drop policy if exists "admins can read payment proofs" on storage.objects;
create policy "admins can read payment proofs"
on storage.objects
for select
to authenticated
using (bucket_id = 'payment-proofs' and public.is_active_admin());

alter table public.orders replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
end $$;
