/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth";
import { getContactInfo, getNavigationItems, getSiteSettings } from "@/lib/data";
import { getInitials } from "@/lib/utils";

const quickCategories = [
  { href: "/products?collection=Roller%20Blinds", label: "Roller" },
  { href: "/products?collection=Zebra%20Blinds", label: "Zebra" },
  { href: "/products?collection=Roman%20Blinds", label: "Roman" },
  { href: "/products?collection=Venetian%20Blinds", label: "Venetian" },
];

export async function SiteHeader() {
  const [settings, navigation, currentUser, currentAdmin, contact] = await Promise.all([
    getSiteSettings(),
    getNavigationItems(),
    getCurrentUser(),
    getCurrentAdmin(),
    getContactInfo(),
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
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)] backdrop-blur-2xl">
      <div className="border-b border-[color-mix(in_srgb,var(--color-line)_70%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_96%,black_4%)] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] lg:px-10">
          <div className="flex flex-wrap items-center gap-3 text-white/82">
            <span>Official blinds and interiors store</span>
            {contact?.phone1 ? <span>Support {contact.phone1}</span> : null}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white/82">
            <Link href="/account" className="hover:text-white">
              {currentUser ? "My account" : "Sign in"}
            </Link>
            <Link href="/checkout/offline" className="hover:text-white">
              Checkout
            </Link>
            {currentAdmin ? (
              <Link href="/admin/dashboard" className="hover:text-white">
                Admin
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.brandName}
              className="h-12 w-12 rounded-2xl object-cover ring-4 ring-white/80"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_66%,black_34%))] text-sm font-extrabold tracking-[0.24em] text-white">
              {getInitials(brandLabel)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-3xl leading-none text-[var(--color-ink)]">
              {brandLabel}
            </p>
            <p className="truncate text-xs font-medium text-[var(--color-muted)]">
              Marketplace for blinds and interior finishing
            </p>
          </div>
        </Link>

        <form action="/products" className="hidden lg:block">
          <div className="flex items-center gap-2 rounded-[1.4rem] border border-[var(--color-line)] bg-white p-2 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]">
            <input
              type="search"
              name="q"
              placeholder="Search roller, zebra, roman, venetian blinds..."
              className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>
        </form>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/account"
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            {currentUser ? "Orders" : "Account"}
          </Link>
          <Link
            href="/checkout/offline"
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            Checkout
          </Link>
          <Link
            href="/products"
            className="rounded-2xl bg-[var(--color-secondary)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            Shop now
          </Link>
        </div>

        <form action="/products" className="lg:hidden">
          <div className="flex items-center gap-2 rounded-[1.2rem] border border-[var(--color-line)] bg-white p-2">
            <input
              type="search"
              name="q"
              placeholder="Search blinds..."
              className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Go
            </button>
          </div>
        </form>
      </div>

      <div className="border-t border-[color-mix(in_srgb,var(--color-line)_70%,transparent)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 lg:px-10">
          <nav className="hidden flex-wrap items-center gap-2 xl:flex">
            {quickCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
              >
                {item.label}
              </Link>
            ))}
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--color-muted)] hover:bg-white hover:text-[var(--color-ink)]"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <details className="relative xl:hidden">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
              Browse menu
            </summary>
            <div className="absolute left-0 top-14 z-10 w-[21rem] rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.45)]">
              <div className="space-y-3">
                <div className="rounded-[1.5rem] bg-[color-mix(in_srgb,var(--color-secondary)_16%,white_84%)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--color-muted)]">
                    Quick categories
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickCategories.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-ink)]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-accent)]"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  href="/account"
                  className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-accent)]"
                >
                  {currentUser ? "My orders" : "Account"}
                </Link>
                <Link
                  href="/checkout/offline"
                  className="block rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </details>

          <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)] lg:block">
            Only admins can list products
          </p>
        </div>
      </div>
    </header>
  );
}
