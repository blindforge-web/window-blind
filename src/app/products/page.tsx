import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getProducts } from "@/lib/data";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const collections = Array.from(new Set(products.map((product) => product.collection))).sort(
    (a, b) => a.localeCompare(b),
  );
  const selectedCollection = params.collection?.trim() || "";
  const filteredProducts = selectedCollection
    ? products.filter((product) => product.collection === selectedCollection)
    : products;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <section className="rounded-[2.7rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,247,251,0.9))] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Product Catalog
              </p>
              <h1 className="mt-3 font-display text-6xl leading-none">
                Browse blinds like a real store, not a long form.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Compare live listings, filter by collection, open rich product pages,
                and continue into checkout only when you are ready to pay.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/checkout/offline"
                  className="rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-semibold text-white"
                >
                  Start checkout
                </Link>
                <Link
                  href="/account"
                  className="rounded-full border border-[var(--color-line)] px-6 py-4 text-sm font-semibold text-[var(--color-ink)]"
                >
                  Track my order
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Live listings
                </p>
                <p className="mt-3 font-display text-4xl">{products.length}</p>
              </article>
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Collections
                </p>
                <p className="mt-3 font-display text-4xl">{collections.length}</p>
              </article>
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-primary)_92%,white_8%)] p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/68">
                  Best path
                </p>
                <p className="mt-3 text-sm leading-7 text-white/84">
                  Choose a product first, then order from its detail page.
                </p>
              </article>
            </div>
          </div>

          {collections.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  !selectedCollection
                    ? "bg-[var(--color-ink)] text-white"
                    : "border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                }`}
              >
                All products
              </Link>
              {collections.map((collection) => (
                <Link
                  key={collection}
                  href={`/products?collection=${encodeURIComponent(collection)}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedCollection === collection
                      ? "bg-[var(--color-ink)] text-white"
                      : "border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                  }`}
                >
                  {collection}
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Showing
              </p>
              <h2 className="mt-2 font-display text-5xl leading-none">
                {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
              </h2>
            </div>
            {selectedCollection ? (
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Filtered by <span className="font-semibold">{selectedCollection}</span>
              </p>
            ) : (
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Open any product to see price, details, measurement options, and the
                order action.
              </p>
            )}
          </div>

          {filteredProducts.length ? (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/70 p-10">
              <h2 className="font-display text-4xl">No products match this filter</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Try another collection or return to the full browse view.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold"
              >
                View all products
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
