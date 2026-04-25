import Link from "next/link";
import { ArrowUpRight, Phone, MapPin, MessageCircle } from "lucide-react";
import {
  getContactInfo,
  getNavigationItems,
  getSiteSettings,
  getSocialLinks,
} from "@/lib/data";

export async function SiteFooter() {
  const [settings, contact, navigation, socialLinks] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getNavigationItems(),
    getSocialLinks(),
  ]);

  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] border border-[var(--color-line)] bg-[linear-gradient(140deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_76%,black_24%))] text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.85)]">
        <div className="grid gap-10 px-6 py-8 lg:grid-cols-[1.1fr_0.7fr_0.9fr] lg:px-10 lg:py-10">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
              {settings?.brandName || "Sunpilot"}
            </div>
            <h2 className="max-w-xl text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
              Better rooms start with better light control.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/72">
              {settings?.footerNote ||
                "Browse collections, choose a fit, place your order, and track progress from one clean customer flow."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Browse catalog
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/account"
                className="rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white"
              >
                Track orders
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/62">
              Explore
            </p>
            <div className="grid gap-2">
              <Link
                href="/products"
                className="rounded-[1rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white/86"
              >
                Product catalog
              </Link>
              <Link
                href="/checkout/order"
                className="rounded-[1rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white/86"
              >
                Place order
              </Link>
              <Link
                href="/account"
                className="rounded-[1rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white/86"
              >
                Account
              </Link>
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="rounded-[1rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white/86"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/62">
              Contact
            </p>
            <div className="space-y-3 text-sm text-white/78">
              {contact?.phone1 ? (
                <p className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-white/6 px-4 py-3">
                  <Phone size={16} className="mt-0.5 shrink-0" />
                  <span>{contact.phone1}</span>
                </p>
              ) : null}
              {contact?.address ? (
                <p className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-white/6 px-4 py-3">
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
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                >
                  <MessageCircle size={14} />
                  {item.displayName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
