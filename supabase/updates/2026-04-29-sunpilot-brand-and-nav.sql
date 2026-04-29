-- Safe incremental update for the Sunpilot storefront refresh.
-- This file only updates the changed brand colors and navigation rows.
-- It does not recreate tables, reseed everything, or touch unrelated data.

begin;

update public.site_settings
set
  primary_color = '#0F4C97',
  secondary_color = '#F2C94C',
  accent_color = '#EAF2FF',
  page_color = '#F7FAFF',
  ink_color = '#0E2A47',
  muted_color = '#5A6B7E',
  line_color = 'rgba(14, 42, 71, 0.12)'
where id = 'default';

insert into public.navbar (id, title, link, sort_order, is_active)
values
  ('nav-home', 'Home', '/', 1, true),
  ('nav-products', 'Products', '/products', 2, true),
  ('nav-team', 'Team', '/team', 3, true),
  ('nav-contact', 'Contact', '/#contact', 4, true)
on conflict (id) do update
set
  title = excluded.title,
  link = excluded.link,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

update public.navbar
set is_active = false
where id in ('nav-about', 'nav-services', 'nav-orders', 'nav-notifications');

commit;
