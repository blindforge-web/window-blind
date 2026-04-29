-- Refreshes seeded storefront copy with production-ready messaging.
-- Safe for live data because it updates existing known records only.

begin;

update public.site_settings
set
  tagline = 'Custom blinds expertly measured, supplied, and delivered across Nigeria.',
  footer_note = 'Sunpilot delivers made-to-measure blinds for homes, offices, hospitality spaces, and project interiors with dependable support from selection to delivery.',
  payment_note = 'Make payment to the account provided, upload your receipt, and the team will confirm your order and next steps.'
where id = 'default';

update public.site_sections as target
set
  eyebrow = source.eyebrow,
  title = source.title,
  subtitle = source.subtitle,
  body = source.body,
  primary_cta_label = source.primary_cta_label,
  primary_cta_link = source.primary_cta_link,
  secondary_cta_label = source.secondary_cta_label,
  secondary_cta_link = source.secondary_cta_link
from (
  values
    (
      'hero',
      'Made-to-measure blinds',
      'Custom blinds for homes, offices, and project spaces',
      'Made-to-measure blinds with dependable support from selection to delivery.',
      'Sunpilot supports private homes, offices, hospitality spaces, and project interiors with practical product guidance, accurate preparation, and coordinated delivery follow-up.',
      'Shop blinds',
      '/products',
      'Track your order',
      '/account'
    ),
    (
      'about',
      'About Sunpilot',
      'Practical blind solutions with dependable service',
      'Based in Onitsha, Sunpilot supports homeowners, offices, and project teams with clear guidance from selection to delivery.',
      'Every order is handled with attention to fit, finish, measurement accuracy, and delivery planning so the final installation feels right in the space.',
      null,
      null,
      null,
      null
    ),
    (
      'products',
      'Featured collections',
      'Blind styles for privacy, light control, and clean finishing',
      'Compare roller, zebra, roman, and venetian blinds suited to residential, commercial, and project spaces.',
      'Review colours, sizing options, and lead times before placing an order with the finish that fits your space.',
      'View all products',
      '/products',
      'Open your account',
      '/account'
    ),
    (
      'services',
      'Our services',
      'Support from selection to delivery',
      'Sunpilot makes it easier to choose the right blind, confirm dimensions, and complete your order with confidence.',
      'From product advice to delivery planning, the process is designed to stay clear, responsive, and dependable.',
      null,
      null,
      null,
      null
    ),
    (
      'reliability',
      'Why customers trust us',
      'A clear order process from payment to fulfilment',
      'Each receipt is reviewed promptly and every order is updated as it moves through confirmation, preparation, and delivery.',
      'Customers can return to their account to review order details, follow updates, and stay informed until the order is complete.',
      null,
      null,
      null,
      null
    ),
    (
      'gallery',
      'Recent installations',
      'Finished spaces and recent blind installations',
      'See how Sunpilot blinds look across homes, offices, and project interiors.',
      'Browse selected spaces that highlight fit, finish, colour balance, and practical light control in real use.',
      null,
      null,
      null,
      null
    ),
    (
      'team',
      'Team',
      'The people behind every order',
      'Support, fabrication, and delivery teams work together to keep each order moving on schedule.',
      'Customers work with a coordinated team that handles product guidance, order preparation, delivery planning, and installation readiness.',
      null,
      null,
      null,
      null
    ),
    (
      'clients',
      'Who we serve',
      'Trusted by homes, offices, and project teams',
      'Sunpilot supports private homes, business spaces, and interior projects that need dependable blind supply and coordinated delivery.',
      'Our work is shaped around spaces that need the right finish, practical advice, and reliable fulfilment from start to handover.',
      null,
      null,
      null,
      null
    ),
    (
      'contact',
      'Contact',
      'Talk to us about your space',
      'Reach out for product enquiries, measurement guidance, and order support.',
      'Speak with the team to discuss blind styles, confirm requirements, or get help with the next step in your order.',
      null,
      null,
      null,
      null
    )
) as source (
  section_key,
  eyebrow,
  title,
  subtitle,
  body,
  primary_cta_label,
  primary_cta_link,
  secondary_cta_label,
  secondary_cta_link
)
where target.section_key = source.section_key;

update public.site_highlights as target
set
  title = source.title,
  description = source.description
from (
  values
    (
      'highlight-made-to-measure',
      'Made to measure',
      'Every order is prepared around the exact size, finish, and control option your space requires.'
    ),
    (
      'highlight-offline-verification',
      'Practical guidance',
      'Customers get clear help with style selection, measurements, and order planning before production begins.'
    ),
    (
      'highlight-account-tracking',
      'Reliable fulfilment',
      'Sunpilot keeps each order moving with coordinated follow-up from confirmation to delivery.'
    )
) as source (id, title, description)
where target.id = source.id;

update public.services as target
set
  title = source.title,
  description = source.description
from (
  values
    (
      'service-residential',
      'Residential blinds',
      'Custom blind options for living rooms, bedrooms, kitchens, and other private spaces that need the right fit, finish, and light control.'
    ),
    (
      'service-office',
      'Office and project supply',
      'Blind solutions for offices, hospitality spaces, shared workspaces, and commercial interiors that need coordinated specification and dependable delivery.'
    ),
    (
      'service-measurement',
      'Measurement guidance',
      'Guidance on sizing, quantity planning, and product selection for accurate orders and clean installation results.'
    )
) as source (id, title, description)
where target.id = source.id;

update public.products as target
set
  short_description = source.short_description,
  description = source.description
from (
  values
    (
      'linen-roller-blind',
      'Smooth light control with a clean fabric finish for bedrooms, offices, and reception spaces.',
      'The Linen Roller Blind combines everyday durability with a soft modern finish, making it a dependable choice for bedrooms, offices, reception areas, and other spaces that need neat light control.'
    ),
    (
      'day-night-zebra-blind',
      'Layered privacy and daylight control for living spaces and front-facing rooms.',
      'The Day and Night Zebra Blind uses alternating fabric bands to balance privacy with natural light, giving living rooms, dining spaces, and customer-facing interiors flexible control throughout the day.'
    ),
    (
      'blackout-roman-blind',
      'Soft fabric styling with stronger light control for restful or presentation-focused rooms.',
      'The Blackout Roman Blind brings a refined fabric look together with stronger light reduction, making it a strong fit for bedrooms, lounges, meeting rooms, and presentation spaces.'
    ),
    (
      'wood-tone-venetian-blind',
      'Adjustable slat control with a warm finish for kitchens, offices, and work areas.',
      'The Wood Tone Venetian Blind offers directional light control, airflow, and a practical wood-look finish suited to kitchens, offices, study areas, and hardworking commercial interiors.'
    )
) as source (slug, short_description, description)
where target.slug = source.slug;

update public.team_members as target
set
  bio = source.bio
from (
  values
    (
      'team-support',
      'Helps customers choose the right blinds, confirm order details, and stay informed from payment to delivery.'
    ),
    (
      'team-production',
      'Prepares each order for accurate fabrication, finishing, and dispatch based on approved specifications.'
    ),
    (
      'team-installation',
      'Coordinates delivery scheduling and helps customers prepare for smooth installation and handover.'
    )
) as source (id, bio)
where target.id = source.id;

commit;
