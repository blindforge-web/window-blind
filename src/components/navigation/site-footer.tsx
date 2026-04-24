import Link from "next/link";
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
    <footer className="border-t border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-surface)_90%,transparent)]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="grid gap-8 rounded-[2.5rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.86))] p-8 lg:grid-cols-[1.15fr_0.75fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
              {settings?.brandName || "Sunpilot"}
            </p>
            <h2 className="font-display text-5xl leading-none text-[var(--color-ink)]">
              Built for easy browsing and confident ordering.
            </h2>
            {settings?.footerNote ? (
              <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                {settings.footerNote}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Shop products
              </Link>
              <Link
                href="/account"
                className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Track my order
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-sm text-[var(--color-muted)]">
            <p className="font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
              Explore
            </p>
            <Link href="/products" className="hover:text-[var(--color-ink)]">
              Product catalog
            </Link>
            <Link href="/checkout/offline" className="hover:text-[var(--color-ink)]">
              Checkout
            </Link>
            <Link href="/account" className="hover:text-[var(--color-ink)]">
              Account
            </Link>
            {navigation.map((item) => (
              <Link key={item.id} href={item.link} className="hover:text-[var(--color-ink)]">
                {item.title}
              </Link>
            ))}
          </div>

          <div className="space-y-4 text-sm text-[var(--color-muted)]">
            <p className="font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
              Contact
            </p>
            {contact?.phone1 ? <p>{contact.phone1}</p> : null}
            {contact?.phone2 ? <p>{contact.phone2}</p> : null}
            {contact?.email ? <p>{contact.email}</p> : null}
            {contact?.address ? <p>{contact.address}</p> : null}
            <div className="flex flex-wrap gap-3 pt-2">
              {socialLinks.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="rounded-full border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
                >
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
