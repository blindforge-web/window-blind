export type SiteSettings = {
  brandName: string;
  shortName: string;
  tagline: string;
  logoUrl: string | null;
  footerNote: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  paymentNote: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pageColor: string;
  surfaceColor: string;
  inkColor: string;
  mutedColor: string;
  lineColor: string;
};

export type ContactInfo = {
  phone1: string;
  phone2: string | null;
  whatsappNumber: string;
  email: string | null;
  address: string;
};

export type NavigationItem = {
  id: string;
  title: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  displayName: string;
  sortOrder: number;
  isActive: boolean;
};

export type SectionKey =
  | "hero"
  | "about"
  | "products"
  | "services"
  | "reliability"
  | "gallery"
  | "team"
  | "clients"
  | "booking"
  | "contact";

export type SiteSection = {
  key: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  body: string | null;
  primaryCtaLabel: string | null;
  primaryCtaLink: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaLink: string | null;
  mediaUrl: string | null;
  mediaKind: "image" | "video";
  mediaAlt: string | null;
  isActive: boolean;
};

export type SiteHighlight = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ClientItem = {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string | null;
  mediaKind: "image" | "video";
  sortOrder: number;
  isActive: boolean;
};

export type OrderStatus = "pending" | "paid" | "paid_delivered";

export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  shortDescription: string;
  description: string;
  imageUrl: string | null;
  basePrice: number;
  salePrice: number | null;
  leadTime: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  isListed: boolean;
  measurements: string[];
  colors: string[];
  features: string[];
  idealFor: string[];
  visual: {
    from: string;
    to: string;
    accent: string;
    label: string;
  };
};

export type DeliveryState = {
  code: string;
  name: string;
  isActive: boolean;
  eta: string;
};

export type PaymentAccount = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  note: string;
};

export type OrderItem = {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  orderType: string;
  description: string;
  status: OrderStatus;
  createdAt: string;
  productName?: string;
  productSlug?: string;
  amount?: number;
  quantity?: number;
  deliveryState?: string;
  width?: string;
  height?: string;
  selectedColor?: string;
  mountType?: string;
  controlSide?: string;
  paymentProofUploaded?: boolean;
  paymentProofUrl?: string | null;
};

export type LandingPageData = {
  settings: SiteSettings | null;
  contact: ContactInfo | null;
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
  sections: Record<string, SiteSection>;
  highlights: SiteHighlight[];
  featuredProducts: Product[];
  services: ServiceItem[];
  teamMembers: TeamMember[];
  clients: ClientItem[];
  galleryItems: GalleryItem[];
  deliveryStates: DeliveryState[];
  paymentAccount: PaymentAccount | null;
};

export type AdminDashboardData = LandingPageData & {
  orders: OrderItem[];
  products: Product[];
};

export type ActionFeedbackState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export type OfflineOrderActionState = ActionFeedbackState & {
  orderReference?: string;
};

export type AdminAuthActionState = {
  status: "idle" | "error";
  message?: string;
};

export type UserIdentity = {
  id: string;
  email: string;
  fullName: string;
};

export type AdminIdentity = UserIdentity & {
  role: string;
};
