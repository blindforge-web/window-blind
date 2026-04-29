/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { getContactInfo, getSiteSettings, getSocialLinks } from "@/lib/data";
import { getInitials } from "@/lib/utils";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Team", href: "/team" },
  { label: "Orders", href: "/orders" },
  { label: "Account", href: "/account" },
];

export async function SiteFooter() {
  const [settings, contact, socialLinks] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getSocialLinks(),
  ]);

  const brandLabel = settings?.shortName || settings?.brandName || "Sunpilot";

  return (
    <footer className="px-4 pb-24 pt-12 sm:px-6 lg:px-10 lg:pb-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_84%,black_16%))] px-6 py-8 text-white shadow-[0_30px_80px_-42px_rgba(14,42,71,0.72)] lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.8fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.brandName || brandLabel}
                  className="h-12 w-12 rounded-[1rem] border border-white/12 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-white/12 text-sm font-extrabold tracking-[0.18em] text-white">
                  {getInitials(brandLabel)}
                </div>
              )}
              <div>
                <p className="text-2xl font-extrabold tracking-[-0.05em]">{brandLabel}</p>
                <p className="text-sm text-white/72">Easy online ordering for custom blinds</p>
              </div>
            </div>
            <h2 className="max-w-xl text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
              Clean navigation, clear buttons, and an easier Sunpilot customer experience.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/76">
              {settings?.footerNote ||
                "Browse products, start an order, upload payment proof, and come back later for updates without getting lost in the website."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="ui-button bg-white px-5 py-3 text-[var(--color-ink)]">
                Browse products
              </Link>
              <Link href="/checkout/order" className="ui-button ui-button-secondary">
                Start order
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Quick links</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Contact</p>
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
