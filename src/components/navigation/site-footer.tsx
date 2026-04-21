import Link from "next/link";
import { getLandingPageData } from "@/lib/data";

export async function SiteFooter() {
  const { settings, contact, navigation, socialLinks } = await getLandingPageData();

  return (
    <footer className="border-t border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-10">
        <div className="space-y-4">
          <p className="font-display text-3xl text-[var(--color-ink)]">
            {settings?.brandName}
          </p>
          {settings?.footerNote ? (
            <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
              {settings.footerNote}
            </p>
          ) : null}
        </div>

        <div className="space-y-3 text-sm text-[var(--color-muted)]">
          <p className="font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
            Navigation
          </p>
          {navigation.map((item) => (
            <Link key={item.id} href={item.link}>
              {item.title}
            </Link>
          ))}
        </div>

        <div className="space-y-3 text-sm text-[var(--color-muted)]">
          <p className="font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
            Contact
          </p>
          {contact?.phone1 ? <p>{contact.phone1}</p> : null}
          {contact?.phone2 ? <p>{contact.phone2}</p> : null}
          {contact?.address ? <p>{contact.address}</p> : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {socialLinks.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="rounded-full border border-[var(--color-line)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
              >
                {item.displayName}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
