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
  'Custom blinds, furniture, and fitted finishes for homes, offices, and commercial spaces.',
  null,
  'Sunpilot handles custom window blind production, furniture orders, measurement support, and delivery coordination from Onitsha.',
  'Update In Admin',
  'Add Account Name',
  'Add Account Number',
  'Update the payment account details in the admin dashboard before accepting live transfer orders.',
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
  ('nav-services', 'Services', '/#services', 3, true),
  ('nav-catalog', 'Catalog', '/catalog', 4, true),
  ('nav-team', 'Team', '/#team', 5, true),
  ('nav-clients', 'Clients', '/#clients', 6, true),
  ('nav-booking', 'Book Order', '/#booking', 7, true),
  ('nav-contact', 'Contact', '/#contact', 8, true)
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
    'Window Blinds and Furniture',
    'Custom-made blinds and furniture for modern interiors',
    'Sunpilot helps homes, offices, and project spaces order finished blinds and furniture with clear production flow and delivery coordination.',
    'Browse live product listings, confirm your measurements, make payment, and submit delivery details directly through the website.',
    'Browse blinds',
    '/catalog',
    'Start checkout',
    '/checkout/offline',
    null,
    'image',
    'Sunpilot hero media',
    true
  ),
  (
    'about',
    'About Sunpilot',
    'Built from Onitsha for clients who want fit, finish, and reliability',
    'Sunpilot operates from No. 8 Awka Road, Onitsha, Anambra State, serving customers who need custom window blinds and furniture orders handled with attention to detail.',
    'The brand combines production, measurement support, and practical delivery planning so customers can move from selection to installation with less friction.',
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
    'services',
    'What We Do',
    'Core service categories',
    'Everything below is editable from the admin dashboard, including photos, descriptions, and order.',
    'Use this section to present the current production and installation focus of the business.',
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
    'Why Choose Us',
    'Operational strengths customers care about',
    'The landing page highlights should explain why a buyer can trust the process from measurement to delivery.',
    'Admins can adjust these reliability cards at any time without code changes.',
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
    'Project Gallery',
    'Photos and videos from recent work',
    'This section supports both image and video uploads from Supabase Storage.',
    'Use it to show fitted blinds, furniture installations, showroom shots, or project walkthrough clips.',
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
    'Meet the Team',
    'The people behind measurement, production, and installation',
    'Team profiles are fully dynamic. Admins can update names, roles, bios, and profile photos at any time.',
    'Social links are intentionally not shown on team cards.',
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
    'Our Clients',
    'Brands, offices, and homes we have served',
    'Client and partner logos are managed from the dashboard and can be swapped whenever needed.',
    'Use this area to show trust signals for new buyers.',
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
    'booking',
    'Book Order',
    'Move from browsing to payment and delivery details',
    'Customers can browse products, select a blind, transfer payment, upload proof, and submit delivery details online.',
    'The checkout and order queue stay connected to Supabase so admins can manage everything from one dashboard.',
    'Browse products',
    '/catalog',
    'Start checkout',
    '/checkout/offline',
    null,
    'image',
    'Sunpilot booking',
    true
  ),
  (
    'contact',
    'Contact Sunpilot',
    'Reach the team directly',
    'Phone lines, WhatsApp, and location details below all come from Supabase and can be updated in the dashboard.',
    'Use this section for enquiries, measurement scheduling, and delivery coordination.',
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
    'highlight-measurement',
    'Measured for your space',
    'Orders can be tailored to window dimensions, preferred control side, finish, and mounting method.',
    1,
    true
  ),
  (
    'highlight-production',
    'Clear production timelines',
    'Lead times and listing visibility stay editable from Supabase so customers always see current availability.',
    2,
    true
  ),
  (
    'highlight-delivery',
    'Delivery detail capture',
    'Buyers submit state and full address details during checkout so fulfilment can be tracked from the admin dashboard.',
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
    'service-blinds',
    'Window blinds manufacturing',
    'Custom blinds for residential, office, and project spaces with tailored sizes, finishes, and control options.',
    null,
    1,
    true
  ),
  (
    'service-furniture',
    'Custom furniture orders',
    'Furniture pieces built to suit interior style, layout requirements, and practical use in homes or commercial spaces.',
    null,
    2,
    true
  ),
  (
    'service-installation',
    'Measurement and installation support',
    'From planning to fitting, Sunpilot can coordinate measurement details, production updates, and delivery preparation.',
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

insert into public.gallery_items (
  id,
  title,
  description,
  media_url,
  media_kind,
  sort_order,
  is_active
)
values
  (
    'gallery-residential',
    'Residential blind finishing',
    'Use this card for fitted home blinds, layered fabrics, or room transformation shots.',
    null,
    'image',
    1,
    true
  ),
  (
    'gallery-office',
    'Office installation',
    'Ideal for office fit-out images or video walkthroughs showing larger commercial installations.',
    null,
    'image',
    2,
    true
  ),
  (
    'gallery-furniture',
    'Furniture detailing',
    'A flexible media slot for furniture projects, close-up craftsmanship, or delivery-ready pieces.',
    null,
    'image',
    3,
    true
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  media_url = excluded.media_url,
  media_kind = excluded.media_kind,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.delivery_states (code, name, is_active, eta)
values
  ('abia', 'Abia', true, '4 to 6 working days'),
  ('adamawa', 'Adamawa', false, '6 to 9 working days'),
  ('akwa-ibom', 'Akwa Ibom', true, '4 to 7 working days'),
  ('anambra', 'Anambra', true, '3 to 5 working days'),
  ('bauchi', 'Bauchi', false, '6 to 9 working days'),
  ('bayelsa', 'Bayelsa', false, '6 to 9 working days'),
  ('benue', 'Benue', true, '4 to 6 working days'),
  ('borno', 'Borno', false, 'Delivery paused'),
  ('cross-river', 'Cross River', true, '5 to 7 working days'),
  ('delta', 'Delta', true, '3 to 5 working days'),
  ('ebonyi', 'Ebonyi', true, '4 to 6 working days'),
  ('edo', 'Edo', true, '3 to 5 working days'),
  ('ekiti', 'Ekiti', true, '3 to 5 working days'),
  ('enugu', 'Enugu', true, '3 to 5 working days'),
  ('fct', 'FCT Abuja', true, '2 to 4 working days'),
  ('gombe', 'Gombe', false, '6 to 9 working days'),
  ('imo', 'Imo', true, '4 to 6 working days'),
  ('jigawa', 'Jigawa', false, '6 to 9 working days'),
  ('kaduna', 'Kaduna', true, '4 to 6 working days'),
  ('kano', 'Kano', true, '4 to 6 working days'),
  ('katsina', 'Katsina', false, '6 to 9 working days'),
  ('kebbi', 'Kebbi', false, '7 to 10 working days'),
  ('kogi', 'Kogi', true, '4 to 6 working days'),
  ('kwara', 'Kwara', true, '3 to 5 working days'),
  ('lagos', 'Lagos', true, '1 to 3 working days'),
  ('nasarawa', 'Nasarawa', true, '3 to 5 working days'),
  ('niger', 'Niger', true, '4 to 6 working days'),
  ('ogun', 'Ogun', true, '2 to 4 working days'),
  ('ondo', 'Ondo', true, '3 to 5 working days'),
  ('osun', 'Osun', true, '3 to 5 working days'),
  ('oyo', 'Oyo', true, '2 to 4 working days'),
  ('plateau', 'Plateau', true, '4 to 6 working days'),
  ('rivers', 'Rivers', true, '4 to 6 working days'),
  ('sokoto', 'Sokoto', false, '7 to 10 working days'),
  ('taraba', 'Taraba', false, '6 to 9 working days'),
  ('yobe', 'Yobe', false, 'Delivery paused'),
  ('zamfara', 'Zamfara', false, 'Delivery paused')
on conflict (code) do update
set
  name = excluded.name,
  is_active = excluded.is_active,
  eta = excluded.eta;

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
    'monarch-blackout',
    'Monarch Blackout',
    'Luxury Blackout',
    'Deep light control with a hotel-grade finish for bedrooms and executive spaces.',
    'Monarch Blackout is built for clients who want absolute privacy, softened acoustics, and a clean premium line across wide windows.',
    148000,
    132000,
    '4 to 6 working days',
    4.9,
    138,
    'Best Seller',
    true,
    array['Custom width up to 300cm', 'Custom drop up to 320cm'],
    array['Ivory Sand', 'Smoke Ash', 'Graphite Bronze', 'Deep Cocoa'],
    array['Full blackout fabric', 'Heat reduction for sun-facing rooms', 'Neat concealed bottom bar', 'Silent chain control'],
    array['Bedrooms', 'Short-let apartments', 'Boardrooms'],
    '#efe3cf',
    '#6b5849',
    '#1f1b18',
    'Blackout'
  ),
  (
    'axis-zebra',
    'Axis Zebra',
    'Modern Dual Layer',
    'Switch between privacy and view with a clean striped roller profile.',
    'Axis Zebra gives clients more control during the day by alternating sheer and opaque layers for offices and contemporary interiors.',
    118000,
    104000,
    '4 to 5 working days',
    4.8,
    94,
    'Office Favorite',
    true,
    array['Custom width up to 290cm', 'Custom drop up to 300cm'],
    array['Pebble Grey', 'Warm Ivory', 'Tea Linen', 'Shadow Stone'],
    array['Dual-layer privacy control', 'Crisp striped silhouette', 'Smooth chain glide', 'Works well on large openings'],
    array['Offices', 'Dining rooms', 'Meeting suites'],
    '#ebe2d3',
    '#73817a',
    '#213830',
    'Zebra'
  ),
  (
    'harbor-roman',
    'Harbor Roman',
    'Structured Roman',
    'Tailored folds that bring a softer luxury finish to statement windows.',
    'Harbor Roman is suited to clients who want fabric presence and crafted structure in high-end residential interiors.',
    164000,
    null,
    '5 to 7 working days',
    4.9,
    63,
    'Designer Pick',
    true,
    array['Custom width up to 260cm', 'Custom drop up to 280cm'],
    array['Stone Biscuit', 'Taupe Linen', 'Forest Dune', 'Cedar Mist'],
    array['Tailored stitched folds', 'Premium face fabric', 'Luxury residential finish', 'Soft stack when raised'],
    array['Dining spaces', 'Master suites', 'Show homes'],
    '#f1e0c8',
    '#91735a',
    '#35281f',
    'Roman'
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

-- After creating an auth user inside Supabase Authentication, register that user as an admin:
-- insert into public.admin_profiles (user_id, full_name, is_active)
-- values ('<auth-user-uuid>', 'Primary Admin', true)
-- on conflict (user_id) do update
-- set full_name = excluded.full_name, is_active = excluded.is_active;
