/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth";
import { getContactInfo, getNavigationItems, getSiteSettings } from "@/lib/data";
import { getInitials } from "@/lib/utils";

function buildQuickLinks(hasUser: boolean, hasAdmin: boolean) {
  return [
    { href: "/products", label: "Shop" },
    { href: "/checkout/offline", label: "Checkout" },
    { href: "/account", label: hasUser ? "My Orders" : "Account" },
    ...(hasAdmin ? [{ href: "/admin/dashboard", label: "Admin" }] : []),
  ];
}

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
        { id: "products", title: "Shop", link: "/products" },
        { id: "services", title: "Services", link: "/#services" },
        { id: "contact", title: "Contact", link: "/#contact" },
      ];
  const quickLinks = buildQuickLinks(Boolean(currentUser), Boolean(currentAdmin));

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] backdrop-blur-2xl">
      <div className="border-b border-[color-mix(in_srgb,var(--color-line)_70%,transparent)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-xs font-semibold tracking-[0.14em] text-[var(--color-muted)] uppercase lg:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_18%,white_82%)] px-3 py-1 text-[var(--color-ink)]">
              Premium made-to-measure blinds
            </span>
            {contact?.phone1 ? <span>Call {contact.phone1}</span> : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/products" className="hover:text-[var(--color-ink)]">
              Shop Collection
            </Link>
            <Link href="/checkout/offline" className="hover:text-[var(--color-ink)]">
              Secure Checkout
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.brandName}
              className="h-12 w-12 rounded-full object-cover ring-4 ring-white/80"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_70%,black_30%))] text-sm font-extrabold tracking-[0.24em] text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.85)]">
              {getInitials(brandLabel)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-3xl leading-none text-[var(--color-ink)]">
              {brandLabel}
            </p>
            <p className="truncate text-xs font-medium text-[var(--color-muted)]">
              Shop blinds, then read more about the company
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/80 p-2 text-sm font-semibold text-[var(--color-muted)] xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="rounded-full px-4 py-2 hover:bg-[var(--color-accent)] hover:text-[var(--color-ink)]"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {quickLinks.slice(0, -1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/products"
            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(10,37,64,0.8)] hover:opacity-92"
          >
            Start shopping
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-sm">
            Menu
          </summary>
          <div className="absolute right-0 top-14 w-[20rem] rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.45)]">
            <div className="space-y-2">
              <div className="rounded-[1.6rem] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--color-primary)_94%,white_6%),color-mix(in_srgb,var(--color-primary)_66%,black_34%))] p-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/70">
                  Store Navigation
                </p>
                <p className="mt-2 text-sm leading-6 text-white/82">
                  Browse products, place an order, then track it from your account.
                </p>
              </div>

              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-[var(--color-line)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-accent)]"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-2">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Company Pages
                </p>
                <div className="mt-2 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-accent)]"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
