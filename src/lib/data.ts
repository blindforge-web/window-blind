import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import type {
  AdminDashboardData,
  ClientItem,
  ContactInfo,
  DeliveryState,
  GalleryItem,
  LandingPageData,
  NavigationItem,
  OrderItem,
  PaymentAccount,
  Product,
  ServiceItem,
  SiteHighlight,
  SiteSection,
  SiteSettings,
  SocialLink,
  TeamMember,
} from "@/lib/types";

type SiteSettingsRow = {
  brand_name: string;
  short_name: string;
  tagline: string;
  logo_url: string | null;
  footer_note: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  payment_note: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  page_color: string;
  surface_color: string;
  ink_color: string;
  muted_color: string;
  line_color: string;
};

type ContactInfoRow = {
  phone_1: string;
  phone_2: string | null;
  whatsapp_number: string;
  email: string | null;
  address: string;
};

type NavbarRow = {
  id: string;
  title: string;
  link: string;
  sort_order: number;
  is_active: boolean;
};

type SocialLinkRow = {
  id: string;
  platform: string;
  url: string;
  display_name: string;
  sort_order: number;
  is_active: boolean;
};

type SiteSectionRow = {
  section_key: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  body: string | null;
  primary_cta_label: string | null;
  primary_cta_link: string | null;
  secondary_cta_label: string | null;
  secondary_cta_link: string | null;
  media_url: string | null;
  media_kind: "image" | "video";
  media_alt: string | null;
  is_active: boolean;
};

type SiteHighlightRow = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type ClientRow = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type GalleryItemRow = {
  id: string;
  title: string;
  description: string | null;
  media_url: string | null;
  media_kind: "image" | "video";
  sort_order: number;
  is_active: boolean;
};

type OrderRow = {
  id: string;
  reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  product_name: string;
  total_amount: number;
  delivery_state: string;
  delivery_address: string;
  notes: string | null;
  status: OrderItem["status"];
  payment_proof_path: string | null;
  created_at: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  short_description: string;
  description: string;
  base_price: number;
  sale_price: number | null;
  lead_time: string;
  rating: number | null;
  review_count: number | null;
  badge: string | null;
  is_listed: boolean;
  measurements: string[] | null;
  colors: string[] | null;
  features: string[] | null;
  ideal_for: string[] | null;
  visual_from: string | null;
  visual_to: string | null;
  visual_accent: string | null;
  visual_label: string | null;
};

type DeliveryStateRow = {
  code: string;
  name: string;
  is_active: boolean;
  eta: string | null;
};

const EMPTY_LANDING_DATA: LandingPageData = {
  settings: null,
  contact: null,
  navigation: [],
  socialLinks: [],
  sections: {},
  highlights: [],
  featuredProducts: [],
  services: [],
  teamMembers: [],
  clients: [],
  galleryItems: [],
  deliveryStates: [],
  paymentAccount: null,
};

function mapSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    brandName: row.brand_name,
    shortName: row.short_name,
    tagline: row.tagline,
    logoUrl: row.logo_url,
    footerNote: row.footer_note,
    bankName: row.bank_name ?? "",
    accountName: row.account_name ?? "",
    accountNumber: row.account_number ?? "",
    paymentNote: row.payment_note ?? "",
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    accentColor: row.accent_color,
    pageColor: row.page_color,
    surfaceColor: row.surface_color,
    inkColor: row.ink_color,
    mutedColor: row.muted_color,
    lineColor: row.line_color,
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    collection: row.collection,
    shortDescription: row.short_description,
    description: row.description,
    basePrice: row.base_price,
    salePrice: row.sale_price,
    leadTime: row.lead_time,
    rating: row.rating ?? 5,
    reviewCount: row.review_count ?? 0,
    badge: row.badge ?? undefined,
    isListed: row.is_listed,
    measurements: row.measurements ?? [],
    colors: row.colors ?? [],
    features: row.features ?? [],
    idealFor: row.ideal_for ?? [],
    visual: {
      from: row.visual_from ?? "#d7e3f1",
      to: row.visual_to ?? "#0A2540",
      accent: row.visual_accent ?? "#D4AF37",
      label: row.visual_label ?? row.collection,
    },
  };
}

function mapDeliveryState(row: DeliveryStateRow): DeliveryState {
  return {
    code: row.code,
    name: row.name,
    isActive: row.is_active,
    eta: row.eta ?? "3 to 6 working days",
  };
}

function mapContactInfo(row: ContactInfoRow): ContactInfo {
  return {
    phone1: row.phone_1,
    phone2: row.phone_2,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    address: row.address,
  };
}

function mapNavbarItem(row: NavbarRow): NavigationItem {
  return {
    id: row.id,
    title: row.title,
    link: row.link,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapSocialLink(row: SocialLinkRow): SocialLink {
  return {
    id: row.id,
    platform: row.platform,
    url: row.url,
    displayName: row.display_name,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapSiteSection(row: SiteSectionRow): SiteSection {
  return {
    key: row.section_key,
    eyebrow: row.eyebrow,
    title: row.title,
    subtitle: row.subtitle,
    body: row.body,
    primaryCtaLabel: row.primary_cta_label,
    primaryCtaLink: row.primary_cta_link,
    secondaryCtaLabel: row.secondary_cta_label,
    secondaryCtaLink: row.secondary_cta_link,
    mediaUrl: row.media_url,
    mediaKind: row.media_kind,
    mediaAlt: row.media_alt,
    isActive: row.is_active,
  };
}

function mapSiteHighlight(row: SiteHighlightRow): SiteHighlight {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapService(row: ServiceRow): ServiceItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapClient(row: ClientRow): ClientItem {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapGalleryItem(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    mediaUrl: row.media_url,
    mediaKind: row.media_kind,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapOrder(row: OrderRow): OrderItem {
  return {
    id: row.id,
    reference: row.reference,
    name: row.customer_name,
    phone: row.customer_phone,
    email: row.customer_email,
    address: row.delivery_address,
    orderType: "Product Order",
    description: row.notes ?? row.product_name,
    status: row.status,
    createdAt: row.created_at,
    productName: row.product_name,
    amount: row.total_amount,
    deliveryState: row.delivery_state,
    paymentProofUploaded: Boolean(row.payment_proof_path),
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle<SiteSettingsRow>();

  return data ? mapSiteSettings(data) : null;
});

export const getPaymentAccount = cache(async (): Promise<PaymentAccount | null> => {
  const settings = await getSiteSettings();

  if (!settings) {
    return null;
  }

  return {
    bankName: settings.bankName,
    accountName: settings.accountName,
    accountNumber: settings.accountNumber,
    note: settings.paymentNote,
  };
});

export const getContactInfo = cache(async (): Promise<ContactInfo | null> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", "default")
    .maybeSingle<ContactInfoRow>();

  return data ? mapContactInfo(data) : null;
});

export const getNavigationItems = cache(async (): Promise<NavigationItem[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("navbar")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data as NavbarRow[] | null)?.map(mapNavbarItem) ?? [];
});

export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data as SocialLinkRow[] | null)?.map(mapSocialLink) ?? [];
});

export const getSiteSections = cache(async (): Promise<Record<string, SiteSection>> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return {};
  }

  const { data } = await supabase
    .from("site_sections")
    .select("*")
    .eq("is_active", true);

  return ((data as SiteSectionRow[] | null) ?? []).reduce<Record<string, SiteSection>>(
    (sections, row) => {
      const mapped = mapSiteSection(row);
      sections[mapped.key] = mapped;
      return sections;
    },
    {},
  );
});

export const getSiteHighlights = cache(async (): Promise<SiteHighlight[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("site_highlights")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data as SiteHighlightRow[] | null)?.map(mapSiteHighlight) ?? [];
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_listed", true)
    .order("created_at", { ascending: false });

  return (data as ProductRow[] | null)?.map(mapProduct) ?? [];
});

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const products = await getProducts();
  return products.slice(0, 4);
});

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export const getDeliveryStates = cache(async (): Promise<DeliveryState[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("delivery_states")
    .select("*")
    .order("name", { ascending: true });

  return (data as DeliveryStateRow[] | null)?.map(mapDeliveryState) ?? [];
});

export const getServices = cache(async (): Promise<ServiceItem[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data as ServiceRow[] | null)?.map(mapService) ?? [];
});

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data as TeamMemberRow[] | null)?.map(mapTeamMember) ?? [];
});

export const getClients = cache(async (): Promise<ClientItem[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data as ClientRow[] | null)?.map(mapClient) ?? [];
});

export const getGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (data as GalleryItemRow[] | null)?.map(mapGalleryItem) ?? [];
});

export const getLandingPageData = cache(async (): Promise<LandingPageData> => {
  if (!hasPublicSupabaseConfig) {
    return EMPTY_LANDING_DATA;
  }

  const [
    settings,
    contact,
    navigation,
    socialLinks,
    sections,
    highlights,
    featuredProducts,
    services,
    teamMembers,
    clients,
    galleryItems,
    deliveryStates,
    paymentAccount,
  ] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getNavigationItems(),
    getSocialLinks(),
    getSiteSections(),
    getSiteHighlights(),
    getFeaturedProducts(),
    getServices(),
    getTeamMembers(),
    getClients(),
    getGalleryItems(),
    getDeliveryStates(),
    getPaymentAccount(),
  ]);

  return {
    settings,
    contact,
    navigation,
    socialLinks,
    sections,
    highlights,
    featuredProducts,
    services,
    teamMembers,
    clients,
    galleryItems,
    deliveryStates,
    paymentAccount,
  };
});

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const landingData = await getLandingPageData();

  if (!hasPublicSupabaseConfig) {
    return {
      ...landingData,
      orders: [],
      products: [],
    };
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("products").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    ...landingData,
    orders: (orders as OrderRow[] | null)?.map(mapOrder) ?? [],
    products: (products as ProductRow[] | null)?.map(mapProduct) ?? [],
  };
}
