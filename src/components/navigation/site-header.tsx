/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
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
  const brandLabel = settings?.shortName || settings?.brandName || "BlindForge";
  const navItems = navigation.length
    ? navigation
    : [
        { id: "home", title: "Home", link: "/#top" },
        { id: "about", title: "About", link: "/#about" },
        { id: "products", title: "Products", link: "/products" },
        { id: "team", title: "Team", link: "/#team" },
        { id: "contact", title: "Contact", link: "/#contact" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_84%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.brandName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-extrabold tracking-[0.24em] text-white">
              {getInitials(brandLabel)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-2xl leading-none text-[var(--color-ink)]">
              {brandLabel}
            </p>
            {settings?.tagline ? (
              <p className="max-w-xs truncate text-xs text-[var(--color-muted)]">
                {settings.tagline}
              </p>
            ) : null}
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--color-muted)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="transition hover:text-[var(--color-ink)]"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/account"
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
          >
            {currentUser ? "My Account" : "Account"}
          </Link>
          {currentAdmin ? (
            <Link
              href="/admin/dashboard"
              className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
            >
              Admin
            </Link>
          ) : null}
          <Link
            href="/products"
            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Browse products
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
            Menu
          </summary>
          <div className="absolute right-0 top-14 w-72 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)]">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
                >
                  {item.title}
                </Link>
              ))}
              <Link
                href="/account"
                className="block rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
              >
                {currentUser ? "My Account" : "Account"}
              </Link>
              {currentAdmin ? (
                <Link
                  href="/admin/dashboard"
                  className="block rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/products"
                className="mt-3 block rounded-2xl bg-[var(--color-primary)] px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Browse products
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
