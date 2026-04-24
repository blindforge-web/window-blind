import Link from "next/link";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";
import { ProductCard } from "@/components/store/product-card";
import { getProducts } from "@/lib/data";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; q?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const collections = Array.from(new Set(products.map((product) => product.collection))).sort(
    (a, b) => a.localeCompare(b),
  );
  const selectedCollection = params.collection?.trim() || "";
  const searchTerm = params.q?.trim().toLowerCase() || "";

  const filteredProducts = products.filter((product) => {
    const matchesCollection = selectedCollection
      ? product.collection === selectedCollection
      : true;
    const haystack = [
      product.name,
      product.collection,
      product.shortDescription,
      product.description,
      ...product.colors,
      ...product.features,
      ...product.idealFor,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = searchTerm ? haystack.includes(searchTerm) : true;
    return matchesCollection && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <section className="rounded-[2.8rem] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,247,251,0.9))] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-secondary)]">
                Marketplace Catalog
              </p>
              <h1 className="mt-3 font-display text-6xl leading-none">
                Shop blinds and interiors by type, colour, and room fit.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                This catalog now behaves more like a marketplace browse screen:
                category-led discovery, search-first navigation, stronger product cards,
                and clearer next steps into checkout and tracking.
              </p>

              <form action="/products" className="mt-6 flex flex-wrap gap-3">
                <input
                  type="search"
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Search by product, colour, feature, room..."
                  className="min-w-[18rem] flex-1 rounded-2xl border border-[var(--color-line)] bg-white px-5 py-4 outline-none"
                />
                {selectedCollection ? (
                  <input type="hidden" name="collection" value={selectedCollection} />
                ) : null}
                <button
                  type="submit"
                  className="rounded-2xl bg-[var(--color-primary)] px-6 py-4 text-sm font-semibold text-white"
                >
                  Search catalog
                </button>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
              <article className="rounded-[2rem] border border-[var(--color-line)] bg-white p-5 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Marketplace rules
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Customers browse and order. Only admins create and list products.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={params.q ? `/products?q=${encodeURIComponent(params.q)}` : "/products"}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !selectedCollection
                  ? "bg-[var(--color-ink)] text-white"
                  : "border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
              }`}
            >
              All products
            </Link>
            {collections.map((collection) => {
              const href = searchTerm
                ? `/products?collection=${encodeURIComponent(collection)}&q=${encodeURIComponent(searchTerm)}`
                : `/products?collection=${encodeURIComponent(collection)}`;
              return (
                <Link
                  key={collection}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    selectedCollection === collection
                      ? "bg-[var(--color-ink)] text-white"
                      : "border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                  }`}
                >
                  {collection}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                Browse by use
              </p>
              <div className="mt-4 space-y-2 text-sm font-semibold text-[var(--color-ink)]">
                <p>Bedrooms</p>
                <p>Living rooms</p>
                <p>Offices</p>
                <p>Reception areas</p>
                <p>Kitchens</p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[var(--color-line)] bg-white/92 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
                Why shop here
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                <p>Marketplace-style product discovery</p>
                <p>Admin-controlled live listings only</p>
                <p>Offline checkout with order tracking</p>
              </div>
            </article>
          </aside>

          <section>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  Showing
                </p>
                <h2 className="mt-2 font-display text-5xl leading-none">
                  {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
                </h2>
              </div>
              <div className="text-sm leading-7 text-[var(--color-muted)]">
                {selectedCollection ? <p>Collection: {selectedCollection}</p> : null}
                {searchTerm ? <p>Search: {params.q}</p> : <p>Choose a product to continue.</p>}
              </div>
            </div>

            {filteredProducts.length ? (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white/70 p-10">
                <h2 className="font-display text-4xl">No products match this search</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  Try another keyword or switch collections.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex rounded-full border border-[var(--color-line)] px-5 py-3 text-sm font-semibold"
                >
                  Reset catalog
                </Link>
              </div>
            )}
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
