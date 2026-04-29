import Link from "next/link";
import { ArrowUpRight, Bell, MapPin, Phone, ShoppingBag } from "lucide-react";
import { getContactInfo, getSiteSettings, getSocialLinks } from "@/lib/data";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Orders", href: "/orders" },
  { label: "Notifications", href: "/notifications" },
  { label: "Account", href: "/account" },
];

export async function SiteFooter() {
  const [settings, contact, socialLinks] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getSocialLinks(),
  ]);

  return (
    <footer className="px-4 pb-24 pt-12 sm:px-6 lg:px-10 lg:pb-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_84%,black_16%))] text-white shadow-[0_30px_80px_-42px_rgba(14,42,71,0.72)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.75fr_0.9fr] lg:px-10 lg:py-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/76">
              {settings?.brandName || "Sunpilot"}
            </span>
            <h2 className="max-w-xl text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
              Order custom blinds online without visiting the showroom.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/76">
              {settings?.footerNote ||
                "Sunpilot now gives customers a cleaner digital storefront for product browsing, order placement, payment proof upload, and delivery tracking."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Browse products
                <ShoppingBag size={16} />
              </Link>
              <Link
                href="/notifications"
                className="inline-flex items-center gap-2 rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
              >
                View updates
                <Bell size={16} />
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Quick links
            </p>
            <div className="mt-4 grid gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white/88"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              Reach Sunpilot
            </p>
            <div className="space-y-3 text-sm text-white/80">
              {contact?.phone1 ? (
                <p className="flex items-start gap-3 rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3">
                  <Phone size={16} className="mt-0.5 shrink-0" />
                  <span>{contact.phone1}</span>
                </p>
              ) : null}
              {contact?.address ? (
                <p className="flex items-start gap-3 rounded-[1rem] border border-white/12 bg-white/8 px-4 py-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>{contact.address}</span>
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
                >
                  {item.displayName}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
