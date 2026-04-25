/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Menu, Phone, ShoppingBag } from "lucide-react";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth";
import { getNavigationItems, getSiteSettings } from "@/lib/data";
import { getInitials } from "@/lib/utils";

export async function SiteHeader() {
  const [settings, navigation, currentUser, currentAdmin] = await Promise.all([
    getSiteSettings(),
    getNavigationItems(),
    getCurrentUser(),
    getCurrentAdmin(),
  ]);

  const brandLabel = settings?.shortName || settings?.brandName || "Sunpilot";
  const navItems = navigation.length
    ? navigation
    : [
        { id: "home", title: "Home", link: "/#top" },
        { id: "about", title: "About", link: "/#about" },
        { id: "products", title: "Products", link: "/products" },
        { id: "services", title: "Services", link: "/#services" },
        { id: "team", title: "Team", link: "/#team" },
        { id: "contact", title: "Contact", link: "/#contact" },
      ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[1.9rem] border border-white/50 bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] px-4 py-3 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.5)] backdrop-blur-2xl sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.brandName}
                  className="h-12 w-12 rounded-[1.2rem] object-cover shadow-[0_12px_30px_-20px_rgba(15,23,42,0.55)]"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,var(--color-primary),color-mix(in_srgb,var(--color-secondary)_58%,var(--color-primary)_42%))] text-sm font-extrabold tracking-[0.22em] text-white shadow-[0_14px_30px_-18px_rgba(10,37,64,0.75)]">
                  {getInitials(brandLabel)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-[-0.04em] text-[var(--color-ink)] sm:text-xl">
                  {brandLabel}
                </p>
                <p className="truncate text-xs text-[var(--color-muted)]">
                  Modern blinds for homes and workspaces
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-[var(--color-line)] bg-white/72 p-1 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-muted)] hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)]"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/78 px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
              >
                <Phone size={16} />
                {currentUser ? "My account" : "Account"}
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(15,23,42,0.7)]"
              >
                <ShoppingBag size={16} />
                Shop now
              </Link>
              {currentAdmin ? (
                <Link
                  href="/admin/dashboard"
                  className="rounded-full border border-[var(--color-line)] bg-white/78 px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
                >
                  Admin
                </Link>
              ) : null}
            </div>

            <details className="relative lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-center rounded-full border border-[var(--color-line)] bg-white/82 p-3 text-[var(--color-ink)]">
                <Menu size={18} />
              </summary>
              <div className="absolute right-0 top-16 w-[19rem] rounded-[1.8rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_94%,white_6%)] p-4 shadow-[0_28px_70px_-28px_rgba(15,23,42,0.5)] backdrop-blur-xl">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="block rounded-[1.1rem] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-accent)]"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 grid gap-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-[var(--color-ink)] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Browse products
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/account"
                    className="rounded-[1.1rem] border border-[var(--color-line)] px-4 py-3 text-center text-sm font-semibold text-[var(--color-ink)]"
                  >
                    {currentUser ? "My account" : "Account access"}
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
