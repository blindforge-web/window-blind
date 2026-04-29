/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Bell, CircleUserRound, House, Package2, ShoppingBag, Users, UserRound } from "lucide-react";
import { getCurrentAdmin, getCurrentUser } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { getInitials } from "@/lib/utils";

const desktopNav = [
  { id: "home", title: "Home", link: "/" },
  { id: "products", title: "Products", link: "/products" },
  { id: "team", title: "Team", link: "/team" },
  { id: "contact", title: "Contact", link: "/#contact" },
];

const mobileNav = [
  { id: "mobile-home", title: "Home", link: "/", icon: House },
  { id: "mobile-products", title: "Products", link: "/products", icon: ShoppingBag },
  { id: "mobile-team", title: "Team", link: "/team", icon: Users },
  { id: "mobile-orders", title: "Orders", link: "/orders", icon: Package2 },
  { id: "mobile-account", title: "Account", link: "/account", icon: UserRound },
];

export async function SiteHeader() {
  const [settings, currentUser, currentAdmin] = await Promise.all([
    getSiteSettings(),
    getCurrentUser(),
    getCurrentAdmin(),
  ]);

  const brandLabel = settings?.shortName || settings?.brandName || "Sunpilot";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(255,255,255,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.brandName || brandLabel}
                className="h-12 w-12 rounded-[1rem] border border-[var(--color-line)] object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[linear-gradient(145deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_74%,white_26%))] text-sm font-extrabold tracking-[0.2em] text-white shadow-[0_16px_30px_-18px_rgba(15,76,151,0.75)]">
                {getInitials(brandLabel)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-2xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                {brandLabel}
              </p>
              <p className="truncate text-sm text-[var(--color-muted)]">
                Made-to-measure blinds, made easy
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {desktopNav.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="text-base font-semibold text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/notifications" className="ui-icon-button" aria-label="Notifications">
              <Bell size={18} />
            </Link>
            <Link href="/checkout/order" className="ui-button ui-button-secondary hidden md:inline-flex">
              Start Order
            </Link>
            <Link
              href={currentAdmin ? "/admin/dashboard" : "/account"}
              className="ui-button ui-button-outline px-3 py-2 sm:px-4"
              aria-label={currentUser ? "Open account" : "Open account access"}
            >
              {currentUser ? (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-extrabold text-[var(--color-primary)]">
                  {getInitials(currentUser.fullName)}
                </span>
              ) : (
                <CircleUserRound size={18} />
              )}
              <span className="hidden sm:inline">
                {currentAdmin ? "Admin" : currentUser ? "Account" : "Login"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-[1.45rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.98)] px-2 py-2 shadow-[0_26px_60px_-34px_rgba(14,42,71,0.35)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.link}
                className="flex flex-col items-center justify-center rounded-[1rem] px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]"
              >
                <span className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary)]">
                  <Icon size={18} />
                </span>
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
