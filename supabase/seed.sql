-- Replace the transfer-account fields below before go-live, or update them from the
-- admin workspace after the initial seed has been applied.

insert into public.site_settings (
  id,
  brand_name,
  short_name,
  tagline,
  logo_url,
  footer_note,
  bank_name,
  account_name,
  account_number,
  payment_note,
  primary_color,
  secondary_color,
  accent_color,
  page_color,
  surface_color,
  ink_color,
  muted_color,
  line_color
)
values (
  'default',
  'Sunpilot',
  'Sunpilot',
  'Made-to-measure blinds for homes, offices, and commercial spaces.',
  null,
  'Sunpilot supplies made-to-measure blinds with practical guidance from selection to delivery.',
  '',
  '',
  '',
  'Complete payment by bank transfer, then attach your receipt so the order can move into confirmation.',
  '#0A2540',
  '#D4AF37',
  '#F5F5F5',
  '#F5F7FA',
  '#FFFFFF',
  '#0F172A',
  '#475569',
  'rgba(10, 37, 64, 0.12)'
)
on conflict (id) do update
set
  brand_name = excluded.brand_name,
  short_name = excluded.short_name,
  tagline = excluded.tagline,
  logo_url = excluded.logo_url,
  footer_note = excluded.footer_note,
  bank_name = excluded.bank_name,
  account_name = excluded.account_name,
  account_number = excluded.account_number,
  payment_note = excluded.payment_note,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  accent_color = excluded.accent_color,
  page_color = excluded.page_color,
  surface_color = excluded.surface_color,
  ink_color = excluded.ink_color,
  muted_color = excluded.muted_color,
  line_color = excluded.line_color;

insert into public.contact_info (
  id,
  phone_1,
  phone_2,
  whatsapp_number,
  email,
  address
)
values (
  'default',
  '09134068772',
  '08156600600',
  '09134068772',
  null,
  'No. 8 Awka Road, Onitsha, Anambra State'
)
on conflict (id) do update
set
  phone_1 = excluded.phone_1,
  phone_2 = excluded.phone_2,
  whatsapp_number = excluded.whatsapp_number,
  email = excluded.email,
  address = excluded.address;

insert into public.navbar (id, title, link, sort_order, is_active)
values
  ('nav-home', 'Home', '/#top', 1, true),
  ('nav-about', 'About', '/#about', 2, true),
  ('nav-products', 'Products', '/products', 3, true),
  ('nav-services', 'Services', '/#services', 4, true),
  ('nav-team', 'Team', '/#team', 5, true),
  ('nav-contact', 'Contact', '/#contact', 6, true)
on conflict (id) do update
set
  title = excluded.title,
  link = excluded.link,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.social_links (id, platform, url, display_name, sort_order, is_active)
values
  (
    'social-whatsapp',
    'whatsapp',
    'https://wa.me/2349134068772',
    'WhatsApp',
    1,
    true
  )
on conflict (id) do update
set
  platform = excluded.platform,
  url = excluded.url,
  display_name = excluded.display_name,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.site_sections (
  section_key,
  eyebrow,
  title,
  subtitle,
  body,
  primary_cta_label,
  primary_cta_link,
  secondary_cta_label,
  secondary_cta_link,
  media_url,
  media_kind,
  media_alt,
  is_active
)
values
  (
    'hero',
    'Made-to-measure blinds',
    'Custom blinds for homes, offices, and commercial spaces',
    'Sunpilot helps customers choose the right blind style, confirm measurements, and place orders with confidence.',
    'Explore the collection, request the right finish for your space, and complete your order through a guided transfer-confirmation flow.',
    'Shop blinds',
    '/products',
    'Track your order',
    '/account',
    null,
    'image',
    'Sunpilot hero media',
    true
  ),
  (
    'about',
    'About Sunpilot',
    'Made-to-measure blinds with a practical installation focus',
    'Sunpilot serves homeowners, offices, and project teams from Onitsha with clear guidance from selection to delivery.',
    'Every order is handled with attention to fit, finish, and the details needed for a smooth installation.',
    null,
    null,
    null,
    null,
    null,
    'image',
    'About Sunpilot',
    true
  ),
  (
    'products',
    'Featured collections',
    'Explore blind styles designed for light control, privacy, and clean finishing',
    'Browse a focused selection of roller, zebra, roman, and venetian blinds suitable for residential and commercial spaces.',
    'Open the full catalog to compare collections, colours, and specifications before placing your order.',
    'View all products',
    '/products',
    'Open your account',
    '/account',
    null,
    'image',
    'Sunpilot products',
    true
  ),
  (
    'services',
    'Our services',
    'Support for selection, measurement, supply, and delivery',
    'Sunpilot supports customers through the key steps required to place blind orders with confidence.',
    'From choosing the right style to confirming dimensions and delivery, the process is designed to stay clear and practical.',
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot services',
    true
  ),
  (
    'reliability',
    'Why customers trust us',
    'A clear order process from receipt review to delivery updates',
    'After payment is made, the transfer receipt is reviewed and the order is updated as it moves through confirmation and delivery.',
    'Customers can return to their account to review submitted details and follow the latest order status.',
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot reliability',
    true
  ),
  (
    'gallery',
    'Recent installations',
    'A look at completed spaces and finished blind installations',
    'Browse selected residential and commercial projects that show our blind finishes in real spaces.',
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot gallery',
    false
  ),
  (
    'team',
    'Team',
    'The people behind every order',
    'Our support, production, and installation teams work together to keep each order moving smoothly.',
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot team',
    true
  ),
  (
    'clients',
    'Who we serve',
    'Trusted for residential, office, and project-based blind supply',
    'Sunpilot supports private homes, business spaces, and interior projects that need dependable blind supply and coordinated delivery.',
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot clients',
    false
  ),
  (
    'contact',
    'Contact',
    'Talk to us about your space',
    'Reach out for product enquiries, measurement guidance, and order support',
    'Contact the team to discuss your preferred blind style, ask questions, or confirm the next step for your order.',
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot contact',
    true
  )
on conflict (section_key) do update
set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  subtitle = excluded.subtitle,
  body = excluded.body,
  primary_cta_label = excluded.primary_cta_label,
  primary_cta_link = excluded.primary_cta_link,
  secondary_cta_label = excluded.secondary_cta_label,
  secondary_cta_link = excluded.secondary_cta_link,
  media_url = excluded.media_url,
  media_kind = excluded.media_kind,
  media_alt = excluded.media_alt,
  is_active = excluded.is_active;

insert into public.site_highlights (id, title, description, sort_order, is_active)
values
  (
    'highlight-made-to-measure',
    'Made to measure',
    'Each order is prepared around the measurements and finish your space requires.',
    1,
    true
  ),
  (
    'highlight-offline-verification',
    'Verified transfer review',
    'Transfer receipts are reviewed before orders move into confirmation and fulfilment.',
    2,
    true
  ),
  (
    'highlight-account-tracking',
    'Simple order tracking',
    'Customers can sign in to review submitted details and check the latest order status.',
    3,
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.services (id, title, description, image_url, sort_order, is_active)
values
  (
    'service-residential',
    'Residential blinds',
    'Custom blind options for living rooms, bedrooms, kitchens, and other private spaces that need the right fit and finish.',
    null,
    1,
    true
  ),
  (
    'service-office',
    'Office and project supply',
    'Blind solutions for offices, shared workspaces, and commercial interiors that require coordinated specification and delivery.',
    null,
    2,
    true
  ),
  (
    'service-measurement',
    'Measurement guidance',
    'Support with product selection, sizing, quantity planning, and the order details needed for accurate production.',
    null,
    3,
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.products (
  slug,
  name,
  collection,
  short_description,
  description,
  base_price,
  sale_price,
  lead_time,
  rating,
  review_count,
  badge,
  is_listed,
  measurements,
  colors,
  features,
  ideal_for,
  visual_from,
  visual_to,
  visual_accent,
  visual_label
)
values
  (
    'linen-roller-blind',
    'Linen Roller Blind',
    'Roller Blinds',
    'A clean roller blind for bedrooms, offices, and reception areas.',
    'The Linen Roller Blind offers smooth light control and a neat finish that suits modern homes, offices, and everyday commercial spaces.',
    85000,
    null,
    '3 to 5 working days',
    4.9,
    18,
    'Popular',
    true,
    array['120cm x 150cm', '150cm x 180cm', '180cm x 220cm'],
    array['Ivory', 'Sand', 'Stone Grey'],
    array['Smooth rolling mechanism', 'Simple daily operation', 'Suitable for home and office use'],
    array['Bedrooms', 'Reception areas', 'Private offices'],
    '#e8edf2',
    '#405568',
    '#d4af37',
    'Roller Blind'
  ),
  (
    'day-night-zebra-blind',
    'Day and Night Zebra Blind',
    'Zebra Blinds',
    'Layered light control for spaces that need privacy and flexibility.',
    'The Day and Night Zebra Blind balances privacy and daylight with alternating fabric bands that adjust easily throughout the day.',
    110000,
    98000,
    '4 to 6 working days',
    4.8,
    11,
    'Sale',
    true,
    array['150cm x 180cm', '180cm x 220cm', '220cm x 240cm'],
    array['White', 'Smoke', 'Mocha'],
    array['Dual-layer fabric design', 'Privacy and light control in one blind', 'Ideal for front-facing rooms and shared spaces'],
    array['Living rooms', 'Dining rooms', 'Front offices'],
    '#f3ede4',
    '#6f5847',
    '#cfb28a',
    'Zebra Blind'
  ),
  (
    'blackout-roman-blind',
    'Blackout Roman Blind',
    'Roman Blinds',
    'A fabric-finish blind for rooms that need stronger light control.',
    'The Blackout Roman Blind combines a softer fabric look with stronger light reduction for bedrooms, lounges, and presentation rooms.',
    130000,
    null,
    '5 to 7 working days',
    4.9,
    9,
    null,
    true,
    array['140cm x 180cm', '180cm x 220cm', '220cm x 260cm'],
    array['Cream', 'Taupe', 'Charcoal'],
    array['Structured fold finish', 'Improved light reduction', 'Works well in decorative interiors'],
    array['Bedrooms', 'Media rooms', 'Private lounges'],
    '#e8dfd6',
    '#5e4a43',
    '#d4af37',
    'Roman Blind'
  ),
  (
    'wood-tone-venetian-blind',
    'Wood Tone Venetian Blind',
    'Venetian Blinds',
    'A slatted blind for spaces that need airflow and directional light control.',
    'The Wood Tone Venetian Blind is a practical option for kitchens, offices, and work areas where customers want control with a warmer finish.',
    95000,
    null,
    '3 to 5 working days',
    4.7,
    7,
    'New',
    true,
    array['120cm x 150cm', '150cm x 180cm', '180cm x 220cm'],
    array['Walnut', 'Oak', 'Coffee Brown'],
    array['Directional light control', 'Durable finish', 'Designed for practical daily use'],
    array['Kitchens', 'Work areas', 'Office partitions'],
    '#d9c6ab',
    '#6d543e',
    '#a97743',
    'Venetian Blind'
  )
on conflict (slug) do update
set
  name = excluded.name,
  collection = excluded.collection,
  short_description = excluded.short_description,
  description = excluded.description,
  base_price = excluded.base_price,
  sale_price = excluded.sale_price,
  lead_time = excluded.lead_time,
  rating = excluded.rating,
  review_count = excluded.review_count,
  badge = excluded.badge,
  is_listed = excluded.is_listed,
  measurements = excluded.measurements,
  colors = excluded.colors,
  features = excluded.features,
  ideal_for = excluded.ideal_for,
  visual_from = excluded.visual_from,
  visual_to = excluded.visual_to,
  visual_accent = excluded.visual_accent,
  visual_label = excluded.visual_label;

insert into public.delivery_states (code, name, is_active, eta)
values
  ('anambra', 'Anambra', true, '2 to 4 working days'),
  ('lagos', 'Lagos', true, '3 to 5 working days'),
  ('abuja', 'Abuja', true, '3 to 6 working days'),
  ('rivers', 'Rivers', true, '3 to 6 working days')
on conflict (code) do update
set
  name = excluded.name,
  is_active = excluded.is_active,
  eta = excluded.eta;

insert into public.team_members (id, name, role, bio, image_url, sort_order, is_active)
values
  (
    'team-support',
    'Customer Support Team',
    'Sales and Support',
    'Guides customers through product selection, order enquiries, and payment follow-up.',
    null,
    1,
    true
  ),
  (
    'team-production',
    'Production Team',
    'Fabrication',
    'Prepares materials and manages production for made-to-measure blind orders.',
    null,
    2,
    true
  ),
  (
    'team-installation',
    'Installation Team',
    'Delivery and Fit',
    'Coordinates delivery and supports installation readiness for completed orders.',
    null,
    3,
    true
  )
on conflict (id) do update
set
  name = excluded.name,
  role = excluded.role,
  bio = excluded.bio,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
