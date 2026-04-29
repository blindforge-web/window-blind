import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
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
        <section className="ui-panel-soft p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
            <div>
              <p className="ui-section-label">Products</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--color-ink)] sm:text-6xl">
                Browse blind styles for homes, offices, and project spaces.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                {settings?.tagline ||
                  "Made-to-measure blinds with dependable support from selection to delivery."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {collections.map((collection) => (
                  <span key={collection} className="ui-pill">
                    {collection}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="ui-panel p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Listed products
                </p>
                <p className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                  {products.length}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Curated styles ready for measurement, specification, and ordering.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-[var(--color-line)] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-primary)_96%,black_4%),color-mix(in_srgb,var(--color-primary)_72%,white_28%))] p-5 text-white shadow-[0_24px_56px_-36px_rgba(14,42,71,0.28)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/68">
                  Support
                </p>
                <p className="mt-2 text-2xl font-extrabold">{contact?.phone1 || "Support available"}</p>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  Ask about measurements, finish selection, or the right blind type before ordering.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        <section className="ui-panel mt-12 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="ui-section-label">Ready To Order</p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--color-ink)]">
                Choose a style, then move straight into checkout.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/checkout/order" className="ui-button ui-button-primary">
                Start Order
                <ArrowRight size={16} />
              </Link>
              <Link href="/orders" className="ui-button ui-button-outline">
                Track Orders
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
