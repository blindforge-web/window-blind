import Link from "next/link";
import { getLandingPageData } from "@/lib/data";
import { getInitials } from "@/lib/utils";

export async function SiteHeader() {
  const { settings, navigation } = await getLandingPageData();
  const bookingLink =
    navigation.find((item) => item.link.includes("#booking"))?.link ?? "/#booking";
  const brandLabel = settings?.shortName || settings?.brandName || "Site";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_82%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
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
          <div>
            <p className="font-display text-2xl leading-none text-[var(--color-ink)]">
              {brandLabel}
            </p>
            {settings?.tagline ? (
              <p className="max-w-xs text-xs text-[var(--color-muted)] sm:block">
                {settings.tagline}
              </p>
            ) : null}
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--color-muted)] md:flex">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="transition hover:text-[var(--color-ink)]"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/login"
            className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
          >
            Admin
          </Link>
          <Link
            href={bookingLink}
            className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Book Order
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
            Menu
          </summary>
          <div className="absolute right-0 top-14 w-72 rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)]">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
                >
                  {item.title}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="block rounded-2xl px-3 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-accent)]"
              >
                Admin
              </Link>
              <Link
                href={bookingLink}
                className="mt-3 block rounded-2xl bg-[var(--color-primary)] px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Book Order
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
