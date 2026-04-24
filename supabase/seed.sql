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
  'Made-to-measure blinds for homes, offices, and commercial interiors.',
  null,
  'Sunpilot manages product selection, measurement guidance, offline payment confirmation, and delivery coordination from one workflow.',
  '',
  '',
  '',
  'Offline transfer orders are confirmed after the admin verifies uploaded proof of payment.',
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
    'Blind systems and interior finishing',
    'Custom blinds built for practical spaces and clean installation',
    'Sunpilot helps homes, offices, and project teams move from product selection to offline payment and delivery confirmation with less friction.',
    'Browse the live catalog, choose a product, pay offline, upload your proof, and wait for admin confirmation.',
    'Browse products',
    '/products',
    'Track orders',
    '/account',
    null,
    'image',
    'Sunpilot hero media',
    true
  ),
  (
    'about',
    'About Sunpilot',
    'A workshop-focused brand for made-to-measure blinds',
    'Sunpilot operates from Onitsha and supports residential, office, and commercial blind orders that need clear communication from selection through delivery.',
    'The business combines measurement support, product guidance, and practical order handling so customers can buy with more confidence.',
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
    'Browse the catalog',
    'Start with a few live products, then open the full browse view',
    'The home page only highlights a small set of products while the full product area handles deeper browsing and checkout.',
    'Use the browse view to compare collections and open full product details before you place an order.',
    'Browse more',
    '/products',
    'Open account',
    '/account',
    null,
    'image',
    'Sunpilot products',
    true
  ),
  (
    'services',
    'What we handle',
    'Service areas around the product workflow',
    'Sunpilot supports customers before, during, and after product selection.',
    'These sections can be edited from the admin dashboard as the business focus changes.',
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
    'Order confidence',
    'Offline payment, proof verification, and manual delivery updates',
    'Customers do not need to guess what happens next after payment. Orders stay visible to admins and can be updated as soon as proof is checked or delivery is completed.',
    'The account area also lets signed-in customers review receipts and track status from their side.',
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
    'Project gallery',
    'Selected visuals from recent work',
    'Show installation finishes, product close-ups, and completed spaces when approved media is available.',
    null,
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot gallery',
    true
  ),
  (
    'team',
    'Team',
    'The people and units that keep orders moving',
    'Show the production, support, and installation teams customers rely on during the order process.',
    null,
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
    'Client trust',
    'Show the businesses, homes, or project types the brand supports',
    'Publish this section only when you have approved logos or partner references to show.',
    null,
    null,
    null,
    null,
    null,
    null,
    'image',
    'Sunpilot clients',
    true
  ),
  (
    'contact',
    'Contact',
    'Reach the business for enquiries, measurements, and delivery coordination',
    'Keep the most current phone numbers, address, and support channels here so visitors know how to continue the conversation.',
    null,
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
    'Made-to-measure fit',
    'Every listed product is positioned around actual room measurements and installation needs.',
    1,
    true
  ),
  (
    'highlight-offline-verification',
    'Offline payment verification',
    'Orders move forward only after uploaded proof is checked by the admin team.',
    2,
    true
  ),
  (
    'highlight-account-tracking',
    'Account-based tracking',
    'Signed-in customers can return to the site to view receipts and current order status.',
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
    'Residential blind supply',
    'Blinds for living rooms, bedrooms, kitchens, and private spaces that need practical measurement and finish support.',
    null,
    1,
    true
  ),
  (
    'service-office',
    'Office and project supply',
    'Product support for workspaces, shared offices, and commercial interiors that need coordinated delivery handling.',
    null,
    2,
    true
  ),
  (
    'service-measurement',
    'Measurement and order support',
    'Guidance on product selection, dimensions, quantity planning, and the order details required for production.',
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
    'A clean roller finish for bedrooms, offices, and reception areas.',
    'The Linen Roller Blind is built for simple light control and a neat visual line, making it a strong fit for modern homes and workspaces.',
    85000,
    null,
    '3 to 5 working days',
    4.9,
    18,
    'Popular',
    true,
    array['120cm x 150cm', '150cm x 180cm', '180cm x 220cm'],
    array['Ivory', 'Sand', 'Stone Grey'],
    array['Smooth rolling mechanism', 'Easy daily control', 'Works across home and office spaces'],
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
    'Layered light control for rooms that need privacy and flexibility.',
    'The Day and Night Zebra Blind balances privacy and natural light with alternating bands that can be adjusted through the day.',
    110000,
    98000,
    '4 to 6 working days',
    4.8,
    11,
    'Sale',
    true,
    array['150cm x 180cm', '180cm x 220cm', '220cm x 240cm'],
    array['White', 'Smoke', 'Mocha'],
    array['Dual-layer fabric effect', 'Privacy and light control in one product', 'Suitable for visible front-facing rooms'],
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
    'A fabric-forward blind option for rooms that need stronger light blocking.',
    'The Blackout Roman Blind adds a softer fabric look while reducing light in bedrooms, lounges, and presentation spaces.',
    130000,
    null,
    '5 to 7 working days',
    4.9,
    9,
    null,
    true,
    array['140cm x 180cm', '180cm x 220cm', '220cm x 260cm'],
    array['Cream', 'Taupe', 'Charcoal'],
    array['Structured fold finish', 'Better light reduction', 'Suitable for more decorative interiors'],
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
    'A slatted finish for spaces that need airflow and directional light control.',
    'The Wood Tone Venetian Blind works well in offices and functional rooms where customers want a practical blind with a warmer appearance.',
    95000,
    null,
    '3 to 5 working days',
    4.7,
    7,
    'New',
    true,
    array['120cm x 150cm', '150cm x 180cm', '180cm x 220cm'],
    array['Walnut', 'Oak', 'Coffee Brown'],
    array['Directional light control', 'Hardwearing finish', 'Suitable for practical daily use'],
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
    'Customer Support Desk',
    'Order Communication',
    'Handles incoming enquiries, order updates, and customer follow-up after payment verification.',
    null,
    1,
    true
  ),
  (
    'team-production',
    'Production Floor',
    'Fabrication',
    'Coordinates material preparation and production scheduling for listed blind collections.',
    null,
    2,
    true
  ),
  (
    'team-installation',
    'Installation Crew',
    'Delivery and Fit',
    'Supports final delivery coordination and installation readiness for completed orders.',
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

