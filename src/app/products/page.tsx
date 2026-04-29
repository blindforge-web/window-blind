import Link from "next/link";
import { ArrowRight, Package2, PhoneCall } from "lucide-react";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getContactInfo, getProducts, getSiteSettings } from "@/lib/data";

export default async function ProductsPage() {
  const [products, settings, contact] = await Promise.all([
    getProducts(),
    getSiteSettings(),
    getContactInfo(),
  ]);

  const collections = Array.from(new Set(products.map((product) => product.collection)));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <section className="grid gap-6 rounded-[2rem] border border-[var(--color-line)] bg-[linear-gradient(150deg,#ffffff,rgba(234,242,255,0.94))] p-6 shadow-[0_30px_70px_-42px_rgba(14,42,71,0.24)] lg:grid-cols-[1.08fr_0.92fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Product catalog
            </p>
            <h1 className="mt-3 max-w-4xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
              Browse Sunpilot blinds without too much navigation.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
              {settings?.tagline ||
                "A focused product screen helps customers move faster from browsing to ordering."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {collections.map((collection) => (
                <span
                  key={collection}
                  className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]"
                >
                  {collection}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.6rem] border border-[var(--color-line)] bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Listed products
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                {products.length}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Simple product cards, clear pricing, and direct order entry.
              </p>
            </article>
            <article className="rounded-[1.6rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_94%,white_6%)] p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/68">
                Customer support
              </p>
              <p className="mt-2 text-2xl font-extrabold">
                {contact?.phone1 || "Support available"}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Ask about measurements, finish selection, or the right blind type before ordering.
              </p>
            </article>
          </div>
        </section>

        {products.length ? (
          <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <section className="mt-10 rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
            <Package2 size={28} className="mx-auto text-[var(--color-primary)]" />
            <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
              No products are listed yet
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Add product listings from the admin dashboard, then this catalog will populate automatically.
            </p>
          </section>
        )}

        <section className="mt-12 rounded-[2rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_20px_46px_-34px_rgba(14,42,71,0.16)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Ready to order
              </p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                Choose a style, then move straight into checkout.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/checkout/order"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Start order
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/orders"
                className="rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Track orders
              </Link>
            </div>
          </div>
          {contact?.phone1 ? (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <PhoneCall size={15} />
              Need help first? Call {contact.phone1}
            </p>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
